import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TriageSession } from '@healthpulse/shared';
import { evaluateTriageSession } from '../services/geminiTriage.service.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

// In-memory triage sessions store seeded with one previous session
const triageSessions = new Map<string, TriageSession>();

const initialDemoSession: TriageSession = {
  session_id: 'session_demo_01',
  created_at: '2026-09-25T10:15:00Z',
  updated_at: '2026-09-25T10:22:00Z',
  session_status: 'completed',
  messages: [
    {
      id: 'msg_1',
      sender: 'assistant',
      content:
        'Hello Elena. I am your HealthPulse Triage Assistant. I can help organize your symptoms and explore appropriate care urgency. Please remember that I do not provide a medical diagnosis. What symptoms are you experiencing?',
      timestamp: '10:15 AM',
    },
    {
      id: 'msg_2',
      sender: 'patient',
      content: 'I have had a mild dull frontal headache since this morning, about 4 hours ago.',
      timestamp: '10:17 AM',
    },
    {
      id: 'msg_3',
      sender: 'assistant',
      content:
        'Thank you for providing that detail. Are you noticing any accompanying signs such as fever, neck stiffness, vision changes, or sensitivity to light?',
      timestamp: '10:18 AM',
    },
    {
      id: 'msg_4',
      sender: 'patient',
      content: 'A little sensitivity to bright screens, but no fever and no stiff neck.',
      timestamp: '10:20 AM',
    },
  ],
  intake_summary: {
    main_symptom: 'Frontal headache',
    started: '4 hours ago',
    severity_tier: 'moderate',
    associated_symptoms: ['Mild screen sensitivity'],
    progression: 'Stable',
    context: 'Working on computer',
  },
  evaluation: {
    urgency: 'medium',
    information_complete: true,
    missing_information: [],
    reported_symptoms: ['Frontal headache', 'Mild screen light sensitivity'],
    duration: '4 hours',
    severity: 'moderate',
    associated_symptoms: ['Mild screen light sensitivity'],
    key_observations: [
      'You reported a moderate frontal headache that began approximately 4 hours ago.',
      'You noted mild sensitivity to screen light without fever or neck stiffness.',
    ],
    suggested_next_step:
      'Consider contacting a healthcare professional, especially if symptoms continue or worsen over the next 24 to 48 hours.',
    warning_signs: [
      'Seek prompt medical care if you develop sudden thunderclap severity, stiff neck, high fever, or vision changes.',
    ],
    emergency_action_required: false,
    disclaimer:
      'HealthPulse provides preliminary health guidance and does not provide a medical diagnosis or replace a qualified healthcare professional. If you are experiencing a life-threatening medical emergency, seek immediate emergency medical care.',
  },
};

triageSessions.set(initialDemoSession.session_id, initialDemoSession);

export async function getTriageSessionsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const list = Array.from(triageSessions.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTriageSessionByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.id || req.params.sessionId;
    const session = triageSessions.get(sessionId);
    if (!session) {
      throw new AppError('Triage session not found.', 404);
    }
    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTriageSessionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { initial_symptom } = req.body;
    const now = new Date();
    const newSession: TriageSession = {
      session_id: `session_${uuidv4().slice(0, 8)}`,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      session_status: 'in_progress',
      messages: [
        {
          id: uuidv4(),
          sender: 'assistant',
          content:
            'Hello Elena. I am your HealthPulse Triage Assistant. I can help organize your symptoms and explore appropriate care urgency. Please remember that I do not provide a medical diagnosis. What symptoms are you experiencing today?',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      intake_summary: {
        main_symptom: initial_symptom || '',
        started: '',
        severity_tier: 'unknown',
        associated_symptoms: [],
        progression: '',
        context: '',
      },
    };

    if (initial_symptom) {
      newSession.messages.push({
        id: uuidv4(),
        sender: 'patient',
        content: initial_symptom,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    triageSessions.set(newSession.session_id, newSession);

    res.status(201).json({
      success: true,
      data: newSession,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.id || req.params.sessionId;
    const { content, updated_intake } = req.body;

    const session = triageSessions.get(sessionId);
    if (!session) {
      throw new AppError('Triage session not found.', 404);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add patient message
    session.messages.push({
      id: uuidv4(),
      sender: 'patient',
      content,
      timestamp: timeStr,
    });

    if (updated_intake) {
      session.intake_summary = {
        ...session.intake_summary,
        ...updated_intake,
      };
    }

    session.updated_at = now.toISOString();

    // Assistant response prompting for clinical context
    let botReply =
      'Thank you for sharing that. How long have you felt this, and on a scale from mild to severe, how would you describe the intensity?';
    if (session.intake_summary.started && session.intake_summary.severity_tier !== 'unknown') {
      botReply =
        'Understood. Are there any associated symptoms, such as fever, dizziness, or localized pain? Whenever you are ready, you can request your clinical guidance summary.';
    }

    session.messages.push({
      id: uuidv4(),
      sender: 'assistant',
      content: botReply,
      timestamp: timeStr,
    });

    triageSessions.set(sessionId, session);

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function evaluateSessionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params.id || req.params.sessionId;
    const session = triageSessions.get(sessionId);
    if (!session) {
      throw new AppError('Triage session not found.', 404);
    }

    const evaluation = await evaluateTriageSession(session);

    session.evaluation = evaluation;
    session.session_status = 'completed';
    session.updated_at = new Date().toISOString();

    triageSessions.set(sessionId, session);

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}
