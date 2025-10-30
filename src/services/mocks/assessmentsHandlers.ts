import { http, HttpResponse } from 'msw';
import { getAssessmentByJobId, saveAssessment, submitAssessmentResponse, getAllAssessments, deleteAssessment, assessmentsDb } from '../db/assessmentsDb';
import { delay, maybeFail } from '../../utils/latency';

export const assessmentsHandlers = [
  // Get all assessments
  http.get('/assessments', async () => {
    await delay();
    
    const assessments = await getAllAssessments();
    
    return HttpResponse.json({
      data: assessments,
      total: assessments.length
    });
  }),

  // Create new assessment
  http.post('/assessments', async ({ request }) => {
    await delay();
    maybeFail();
    
    const assessmentData = await request.json() as any;
    
    const savedAssessment = await saveAssessment(assessmentData);
    
    return HttpResponse.json(savedAssessment);
  }),

  // Get assessment by ID (NOT jobId)
  http.get('/assessments/:id', async ({ params }) => {
    await delay();
    
    const { id } = params;
    
    // Get assessment by its ID, not jobId
    const assessment = await assessmentsDb.assessments.get(id as string);
    
    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(assessment);
  }),

  // Get assessment by job ID (separate endpoint)
  http.get('/assessments/by-job/:jobId', async ({ params }) => {
    await delay();
    
    const assessment = await getAssessmentByJobId(params.jobId as string);
    
    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(assessment);
  }),

  // Update assessment
  http.put('/assessments/:id', async ({ params, request }) => {
    await delay();
    maybeFail();
    
    const assessmentData = await request.json() as any;
    const savedAssessment = await saveAssessment(assessmentData);
    return HttpResponse.json(savedAssessment);
  }),

  // Submit assessment response
  http.post('/assessments/:jobId/submit', async ({ params, request }) => {
    await delay();
    maybeFail();
    
    const responses = await request.json() as any;
    const result = await submitAssessmentResponse(params.jobId as string, responses);
    return HttpResponse.json(result);
  }),

  // Delete assessment
  http.delete('/assessments/:id', async ({ params }) => {
    await delay();
    maybeFail();
    await deleteAssessment(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
