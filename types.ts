export enum Language {
  EN = 'en',
  ES = 'es',
}

export type User = {
  name: string;
  email: string;
} | null;

export type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export type AuthMode = 'login' | 'signup';

export enum PatientId {
  TomasPerez = 'TomasPerez',
  AntoniaFlores = 'AntoniaFlores',
}

export type Patient = {
  id: PatientId;
  nameKey: string;
  descriptionKey: string;
  avatarUrl: string;
  voiceName: string;
};