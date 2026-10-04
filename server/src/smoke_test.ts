import { app, server } from './index.js';
import { env } from './config/env.js';
import fs from 'fs';
import path from 'path';

async function runSmokeTests() {
  console.log('\n======================================================');
  console.log('   STARTING HEALTHPULSE END-TO-END SMOKE TESTS');
  console.log('======================================================');
  const baseUrl = `http://localhost:${env.PORT}/api`;
  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, desc: string, details?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      if (details) console.error('     Details:', details);
      failCount++;
    }
  }

  try {
    // 1. Healthcheck
    console.log('\n[1] Verifying System Healthcheck...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = (await healthRes.json()) as any;
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthJson.status === 'healthy', 'Healthcheck reports status "healthy"');
    assert(healthJson.service === 'HealthPulse API Service', 'Reports correct service name');

    // 2. Vitals Dashboard Data
    console.log('\n[2] Verifying Patient Vitals Telemetry...');
    const vitalsRes = await fetch(`${baseUrl}/vitals`);
    const vitalsEnvelope = (await vitalsRes.json()) as any;
    assert(vitalsRes.status === 200, 'GET /api/vitals returns 200 OK');
    assert(vitalsEnvelope.success === true, 'Response contains success: true');
    const vitalsData = vitalsEnvelope.data;
    assert(Boolean(vitalsData.cards), 'cards object exists');
    assert(Boolean(vitalsData.cards.heart_rate), 'heart_rate vital card present');
    assert(Boolean(vitalsData.cards.blood_pressure), 'blood_pressure vital card present');
    assert(Boolean(vitalsData.cards.sleep), 'sleep vital card present');
    assert(Boolean(vitalsData.cards.spo2), 'spo2 vital card present');
    assert(Boolean(vitalsData.trends?.sevenDays), '7-day trend telemetry present');
    assert(Boolean(vitalsData.trends?.thirtyDays), '30-day trend telemetry present');
    assert(Array.isArray(vitalsData.daily), 'daily indicators array present');
    assert(Boolean(vitalsData.summary?.isDemoData), 'Explicitly marked as simulated/demo data');

    // 3. Log Vital Reading
    console.log('\n[3] Verifying Vital Manual Reading Logging...');
    const logRes = await fetch(`${baseUrl}/vitals/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: 'heart_rate',
        value: '74',
        timestamp: new Date().toISOString(),
      }),
    });
    const logEnvelope = (await logRes.json()) as any;
    assert(logRes.status === 200, 'POST /api/vitals/log returns 200 OK');
    assert(logEnvelope.success === true, 'Vital logging recorded successfully');

    // 4. Documents List
    console.log('\n[4] Verifying Medical Document Vault...');
    const docsRes = await fetch(`${baseUrl}/documents`);
    const docsEnvelope = (await docsRes.json()) as any;
    assert(docsRes.status === 200, 'GET /api/documents returns 200 OK');
    assert(Array.isArray(docsEnvelope.data), 'Documents list returned as array');
    const existingDoc = docsEnvelope.data[0];
    assert(Boolean(existingDoc?.id), 'Found existing seed document in vault');

    // 5. Document Upload & Extraction
    console.log('\n[5] Verifying Document Ingestion & Safe Extraction...');
    const testFilePath = path.resolve('temp_test_report.pdf');
    fs.writeFileSync(
      testFilePath,
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n164\n%%EOF'
    );

    const formData = new FormData();
    const fileBytes = fs.readFileSync(testFilePath);
    const blob = new Blob([fileBytes], { type: 'application/pdf' });
    formData.append('file', blob, 'test_lab_report.pdf');

    const uploadRes = await fetch(`${baseUrl}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadEnvelope = (await uploadRes.json()) as any;
    assert(uploadRes.status === 201, 'POST /api/documents/upload returns 201 Created');
    assert(Boolean(uploadEnvelope.data?.id), 'Uploaded document received unique ID');
    assert(
      uploadEnvelope.data?.user_confirmed === false,
      'Document initialized with user_confirmed: false'
    );
    assert(Boolean(uploadEnvelope.data?.extracted_data), 'Clinical extracted_data generated');

    const createdDocId = uploadEnvelope.data.id;
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);

    // 6. Confirm Verification
    console.log('\n[6] Verifying Patient Confirmation of Document...');
    const confirmRes = await fetch(`${baseUrl}/documents/${createdDocId}/confirm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true }),
    });
    const confirmEnvelope = (await confirmRes.json()) as any;
    assert(confirmRes.status === 200, 'PATCH /api/documents/:id/confirm returns 200 OK');
    assert(
      confirmEnvelope.data?.user_confirmed === true,
      'Document user_confirmed updated to true'
    );
    assert(
      Boolean(confirmEnvelope.data?.confirmed_at),
      'Timestamp confirmed_at recorded for patient verification'
    );

    // 7. Flag Discrepancy
    console.log('\n[7] Verifying Patient Flagging of Discrepancies...');
    const flagRes = await fetch(`${baseUrl}/documents/${createdDocId}/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'The extracted date was misaligned with the report timestamp.',
      }),
    });
    const flagEnvelope = (await flagRes.json()) as any;
    assert(flagRes.status === 200, 'POST /api/documents/:id/flag returns 200 OK');
    assert(
      flagEnvelope.data?.flagged_for_review === true,
      'Document state flagged_for_review set to true'
    );

    // 8. Triage Session Flow
    console.log('\n[8] Verifying Symptoms Triage Vertical Slice...');
    const sessionRes = await fetch(`${baseUrl}/triage/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initial_symptom: 'Scratchy throat and mild dry cough',
      }),
    });
    const sessionEnvelope = (await sessionRes.json()) as any;
    assert(sessionRes.status === 201, 'POST /api/triage/sessions returns 201 Created');
    assert(
      sessionEnvelope.data?.session_status === 'in_progress',
      'Initial session status is in_progress'
    );
    const sessionId = sessionEnvelope.data.session_id;

    // 9. Add Message to Session
    console.log('\n[9] Adding Patient Symptom Message...');
    const msgRes = await fetch(`${baseUrl}/triage/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content:
          'I have had a mild dry cough and slight scratchy throat for 2 days. No shortness of breath, no chest pain.',
      }),
    });
    const msgEnvelope = (await msgRes.json()) as any;
    assert(msgRes.status === 200, 'POST /api/triage/sessions/:id/messages returns 200 OK');
    assert(
      msgEnvelope.data?.messages.length >= 2,
      'Patient message appended to session transcript'
    );

    // 10. Evaluate Triage Session
    console.log('\n[10] Requesting Triage Evaluation...');
    const evalRes = await fetch(`${baseUrl}/triage/sessions/${sessionId}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: 'Completed full intake interview',
      }),
    });
    const evalEnvelope = (await evalRes.json()) as any;
    assert(evalRes.status === 200, 'POST /api/triage/sessions/:id/evaluate returns 200 OK');
    assert(
      evalEnvelope.data?.session_status === 'completed',
      'Session status is completed'
    );
    const evaluation = evalEnvelope.data?.evaluation;
    assert(
      ['low', 'medium', 'high', 'emergency'].includes(evaluation.urgency),
      `Urgency level is valid care category (${evaluation.urgency})`
    );
    assert(
      Array.isArray(evaluation.key_observations),
      'key_observations array present in evaluation'
    );
    assert(
      Boolean(evaluation.suggested_next_step),
      'suggested_next_step recommendation present'
    );
    assert(
      Boolean(evaluation.disclaimer),
      'Standard medical non-diagnostic disclaimer present'
    );
    assert(
      evalEnvelope.data.session_status !== evaluation.urgency,
      'Session status decoupled from care urgency'
    );

    // 11. Fetch Triage Session by ID
    console.log('\n[11] Retrieving Completed Triage Session...');
    const getSessionRes = await fetch(`${baseUrl}/triage/sessions/${sessionId}`);
    const getSessionEnvelope = (await getSessionRes.json()) as any;
    assert(getSessionRes.status === 200, 'GET /api/triage/sessions/:id returns 200 OK');
    assert(
      getSessionEnvelope.data?.session_id === sessionId,
      'Session ID matches requested session'
    );
    assert(
      getSessionEnvelope.data?.session_status === 'completed',
      'Persisted session state retained'
    );

    // 12. Production Gating Safety Invariant
    console.log('\n[12] Verifying Production Gating Safety Invariant...');
    const originalEnv = env.NODE_ENV;
    try {
      (env as any).NODE_ENV = 'production';
      let caughtError: any = null;
      try {
        const { evaluateTriageSession } = await import('./services/geminiTriage.service.js');
        await evaluateTriageSession(sessionEnvelope.data);
      } catch (err: any) {
        caughtError = err;
      }
      assert(caughtError !== null, 'Production environment blocks unconfigured Gemini calls');
      assert(caughtError?.statusCode === 503, 'Returns safe HTTP 503 error code in production');
      assert(
        caughtError?.safeUserMessage?.includes('temporarily unavailable'),
        'Returns non-leaking user-safe message in production'
      );
    } finally {
      (env as any).NODE_ENV = originalEnv;
    }

    console.log(`\n======================================================`);
    console.log(`  SMOKE TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`======================================================\n`);

    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    server.close();

    if (failCount > 0) {
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  } catch (error) {
    console.error('Fatal error during smoke test:', error);
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    server.close();
    process.exitCode = 1;
  }
}

runSmokeTests();
