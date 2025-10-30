import Dexie, { type EntityTable } from 'dexie';
import { type Assessment, assessmentsSeed } from '../seed/assessmentsSeed';

class AssessmentsDB extends Dexie {
  assessments!: EntityTable<Assessment, 'id'>;

  constructor() {
    super('AssessmentsDB');
    this.version(1).stores({
      assessments: '&id, jobId'
    });
  }
}

export const assessmentsDb = new AssessmentsDB();

export const initializeAssessments = async () => {
  try {
    const assessmentsCount = await assessmentsDb.assessments.count();
    if(assessmentsCount > 0) {
      return;
    }

    await assessmentsDb.assessments.clear();
    await assessmentsDb.assessments.bulkAdd(assessmentsSeed);
  
  } catch (error) {
    console.error("Error initializing assessments:", error);
  }
};

// Get assessment by its ID (not jobId)
export const getAssessmentById = async (id: string) => {
  return assessmentsDb.assessments.get(id);
};

// Get assessment by job ID
export const getAssessmentByJobId = async (jobId: string) => {
  return assessmentsDb.assessments.where('jobId').equals(jobId).first();
};

export const getAllAssessments = async () => {
  const assessments = await assessmentsDb.assessments.toArray();
  return assessments;
};

export const saveAssessment = async (assessment: Assessment) => {
  await assessmentsDb.assessments.put(assessment);
  return assessment;
};

export const submitAssessmentResponse = async (jobId: string, responses: Record<string, any>) => {
  localStorage.setItem(`assessment-response-${jobId}`, JSON.stringify({
    responses,
    submittedAt: new Date()
  }));
  return { success: true };
};

export const getAssessmentStatistics = async () => {
  const allAssessments = await assessmentsDb.assessments.toArray();
  
  let completedCount = 0;
  for (const assessment of allAssessments) {
    const response = localStorage.getItem(`assessment-response-${assessment.jobId}`);
    if (response) {
      completedCount++;
    }
  }
  
  return {
    totalAssessments: allAssessments.length,
    completedAssessments: completedCount,
    pendingAssessments: allAssessments.length - completedCount
  };
};

export const deleteAssessment = async (id: string) => {
  await assessmentsDb.assessments.delete(id);
  return true;
};
