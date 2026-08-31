export interface LookupItem {
  id: string;
  name: string;
}

export type Department = LookupItem;
export type Function = LookupItem;
export type Industry = LookupItem;

export interface Lesson {
  id: string;
  title: string;
  projectName: string;
  departmentId: string;
  departmentName: string;
  functionId: string;
  functionName: string;
  industryId: string;
  industryName: string;
  valueProposition: string;
  description: string;
  imageUrl?: string | null;
  personToContact?: string | null;
  createdDate: string;
  modifiedDate: string;
}

export interface CreateLessonDto {
  title: string;
  projectName: string;
  departmentId: string;
  functionId: string;
  industryId: string;
  valueProposition: string;
  description: string;
  imageUrl?: string;
  personToContact?: string;
}

export type UpdateLessonDto = CreateLessonDto;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}