import React from 'react';
import { TriageEvaluationResult } from '@healthpulse/shared';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ReportedSymptoms } from './ReportedSymptoms';
import { KeyObservations } from './KeyObservations';
import { SuggestedNextStep } from './SuggestedNextStep';
import { WarningSigns } from './WarningSigns';
import { AssessmentLimitations } from './AssessmentLimitations';
import { EmergencyTriageState } from './EmergencyTriageState';
import { Tag } from 'lucide-react';

interface TriageSummaryProps {
  evaluation: TriageEvaluationResult;
  onOpenEmergencyModal?: () => void;
}

export const TriageSummary: React.FC<TriageSummaryProps> = ({
  evaluation,
  onOpenEmergencyModal,
}) => {
  const isEmergency = evaluation.urgency === 'emergency' || evaluation.emergency_action_required;

  return (
    <div className="space-y-6">
      {/* 1. Emergency Treatment or Standard Urgency Header */}
      {isEmergency ? (
        <EmergencyTriageState
          suggestedNextStep={evaluation.suggested_next_step}
          onOpenEmergencyModal={onOpenEmergencyModal}
        />
      ) : (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Care Guidance Urgency Tier
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Preliminary Symptom Evaluation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Observational clinical triage based on your intake statements
            </p>
          </div>
          <UrgencyBadge urgency={evaluation.urgency} />
        </div>
      )}

      {/* 2 & 3. Reported Symptoms, Severity, Duration */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card space-y-4">
        <ReportedSymptoms
          symptoms={evaluation.reported_symptoms}
          severity={evaluation.severity}
          duration={evaluation.duration}
        />

        {/* 4. Associated Symptoms */}
        {evaluation.associated_symptoms.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Accompanying Symptoms Noted
            </span>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.associated_symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Key Observations */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card">
        <KeyObservations observations={evaluation.key_observations} />
      </div>

      {/* 6. Suggested Next Step */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card">
        <SuggestedNextStep
          nextStep={evaluation.suggested_next_step}
          urgency={evaluation.urgency}
        />
      </div>

      {/* 7. Warning Signs */}
      {evaluation.warning_signs.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card">
          <WarningSigns warningSigns={evaluation.warning_signs} />
        </div>
      )}

      {/* 8. Assessment Limitations */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card">
        <AssessmentLimitations
          informationComplete={evaluation.information_complete}
          missingInformation={evaluation.missing_information}
        />
      </div>

      {/* 9. Medical Disclaimer */}
      <DisclaimerBanner type="triage" />
    </div>
  );
};
