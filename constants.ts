import { Patient, PatientId } from './types';

export const patients: Patient[] = [
  {
    id: PatientId.TomasPerez,
    nameKey: 'dashboard.patientNameTomas',
    descriptionKey: 'dashboard.patientDescTomas',
    avatarUrl: 'https://picsum.photos/seed/tomas-perez/100/100',
    voiceName: 'Charon',
  },
  {
    id: PatientId.AntoniaFlores,
    nameKey: 'dashboard.patientNameAntonia',
    descriptionKey: 'dashboard.patientDescAntonia',
    avatarUrl: 'https://picsum.photos/seed/antonia-flores/100/100',
    voiceName: 'Kore',
  },
];


export const translations = {
  en: {
    header: {
      howItWorks: "How it Works",
      forIndividuals: "For Individuals",
      forInstitutions: "For Institutions",
      pricing: "Pricing",
      login: "Login",
      signup: "Sign Up for Free Trial",
    },
    hero: {
      headline: "Master Your Therapeutic Skills. Practice with AI, Perfect Your Craft.",
      subheadline: "A secure and realistic simulation platform for psychologists to practice key therapeutic interventions anytime, anywhere.",
      cta: "Start Your First Session",
    },
    howItWorks: {
      title: "How It Works",
      step1Title: "Sign Up & Log In.",
      step1Desc: "Create your secure account in seconds.",
      step2Title: "Select a Patient.",
      step2Desc: "Choose from our library of AI patient personas with unique backgrounds and challenges.",
      step3Title: "Start Practicing.",
      step3Desc: "Engage in a realistic text-based therapy session and receive instant feedback.",
    },
    auth: {
      loginTitle: "Log in to your account",
      signupTitle: "Create your account",
      emailLabel: "Email",
      passwordLabel: "Password",
      nameLabel: "Full Name",
      loginButton: "Login",
      signupButton: "Sign Up",
      switch_to_signup: "Don't have an account? Sign Up",
      switch_to_login: "Already have an account? Login",
      or: "OR",
      googleSignIn: "Sign in with Google",
    },
    dashboard: {
      welcome: "Welcome back",
      title: "Select a Practice Model",
      patientNameTomas: "Tomás Pérez",
      patientDescTomas: "A 34-year-old patient simulation focused on achieving remoralization by exploring exceptions to his narrative of failure.",
      patientNameAntonia: "Antonia Flores",
      patientDescAntonia: "A 20-year-old patient simulation focused on co-constructing therapeutic goals to address anhedonia and a sense of lost identity.",
      startSession: "Start Session",
      logout: "Logout",
    },
    chat: {
      inputPlaceholder: "Type your response...",
      send: "Send",
      endSession: "End Session",
      headerTomas: "Practicing with Tomás Pérez",
      loadingTomas: "Tomás is thinking...",
      headerAntonia: "Practicing with Antonia Flores",
      loadingAntonia: "Antonia is thinking...",
    }
  },
  es: {
    header: {
      howItWorks: "Cómo Funciona",
      forIndividuals: "Para Psicólogos",
      forInstitutions: "Para Instituciones",
      pricing: "Precios",
      login: "Ingresar",
      signup: "Prueba Gratis",
    },
    hero: {
      headline: "Domina tus Habilidades Terapéuticas. Practica con IA, Perfecciona tu Técnica.",
      subheadline: "Una plataforma de simulación segura y realista para que psicólogos practiquen intervenciones terapéuticas clave, en cualquier momento y lugar.",
      cta: "Comienza tu Primera Sesión",
    },
    howItWorks: {
      title: "Cómo Funciona",
      step1Title: "Regístrate e Ingresa.",
      step1Desc: "Crea tu cuenta segura en segundos.",
      step2Title: "Selecciona un Paciente.",
      step2Desc: "Elige de nuestra biblioteca de pacientes IA con perfiles y desafíos únicos.",
      step3Title: "Comienza a Practicar.",
      step3Desc: "Inicia una sesión de terapia realista basada en texto y recibe feedback instantáneo.",
    },
    auth: {
      loginTitle: "Ingresa a tu cuenta",
      signupTitle: "Crea tu cuenta",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      nameLabel: "Nombre Completo",
      loginButton: "Ingresar",
      signupButton: "Registrarse",
      switch_to_signup: "¿No tienes una cuenta? Regístrate",
      switch_to_login: "¿Ya tienes una cuenta? Ingresa",
      or: "O",
      googleSignIn: "Ingresar con Google",
    },
    dashboard: {
      welcome: "¡Bienvenido/a de vuelta",
      title: "Selecciona un Modelo de Práctica",
      patientNameTomas: "Tomás Pérez",
      patientDescTomas: "Una simulación de paciente de 34 años, enfocada en lograr la remoralización explorando excepciones a su narrativa de fracaso.",
      patientNameAntonia: "Antonia Flores",
      patientDescAntonia: "Una simulación de paciente de 20 años, enfocada en co-construir objetivos terapéuticos para la anhedonia y su sensación de identidad perdida.",
      startSession: "Iniciar Sesión",
      logout: "Cerrar Sesión",
    },
    chat: {
      inputPlaceholder: "Escribe tu respuesta...",
      send: "Enviar",
      endSession: "Terminar Sesión",
      headerTomas: "Practicando con Tomás Pérez",
      loadingTomas: "Tomás está pensando...",
      headerAntonia: "Practicando con Antonia Flores",
      loadingAntonia: "Antonia está pensando...",
    }
  }
};