import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper function to read CSV file
const readCSV = (filename: string) => {
  const filePath = path.join(DATA_DIR, filename);
  // If the file doesn't exist, return an empty array
  if (!fs.existsSync(filePath)) {
    return [] as any[];
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  if (!fileContent.trim()) {
    return [] as any[];
  }
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
};

// Helper function to write CSV file
const writeCSV = (filename: string, data: any[]) => {
  // Ensure the data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, filename);
  const csvContent = stringify(data, { header: true });
  fs.writeFileSync(filePath, csvContent);
};

// User operations
export const userOperations = {
  async createUser(email: string, password: string, name: string) {
    const users = readCSV('users.csv');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      has_completed_questionnaire: false,
    };
    users.push(newUser);
    writeCSV('users.csv', users);
    return newUser;
  },

  async authenticateUser(email: string, password: string) {
    const users = readCSV('users.csv');
    const user = users.find((u: any) => u.email === email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // Update last login
    user.last_login = new Date().toISOString();
    writeCSV('users.csv', users);
    
    return user;
  },

  async getUserById(id: number) {
    const users = readCSV('users.csv');
    return users.find((u: any) => u.id === id);
  },

  async updateUserQuestionnaireStatus(userId: number, completed: boolean) {
    const users = readCSV('users.csv');
    const user = users.find((u: any) => u.id === userId);
    if (user) {
      user.has_completed_questionnaire = completed;
      writeCSV('users.csv', users);
    }
  },
};

// User preferences operations
export const preferencesOperations = {
  async getUserPreferences(userId: number) {
    const preferences = readCSV('user_preferences.csv');
    return preferences.find((p: any) => p.user_id === userId);
  },

  async updateUserPreferences(userId: number, preferences: any) {
    const allPreferences = readCSV('user_preferences.csv');
    const index = allPreferences.findIndex((p: any) => p.user_id === userId);
    
    if (index !== -1) {
      allPreferences[index] = { ...allPreferences[index], ...preferences };
    } else {
      allPreferences.push({ user_id: userId, ...preferences });
    }
    
    writeCSV('user_preferences.csv', allPreferences);
  },
};

// Questionnaire operations
export const questionnaireOperations = {
  async saveQuestionnaireAnswers(userId: number, answers: any) {
    const allAnswers = readCSV('questionnaire_answers.csv');
    const newAnswer = {
      user_id: userId,
      ...answers,
      created_at: new Date().toISOString(),
    };
    allAnswers.push(newAnswer);
    writeCSV('questionnaire_answers.csv', allAnswers);
  },

  async getQuestionnaireAnswers(userId: number) {
    const answers = readCSV('questionnaire_answers.csv');
    return answers.find((a: any) => a.user_id === userId);
  },
};

// Journal operations
export const journalOperations = {
  async createJournalEntry(userId: number, content: string, mood: string) {
    const entries = readCSV('journal_entries.csv');
    const newEntry = {
      id: entries.length + 1,
      user_id: userId,
      content,
      mood,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    entries.push(newEntry);
    writeCSV('journal_entries.csv', entries);
    return newEntry;
  },

  async getJournalEntries(userId: number) {
    const entries = readCSV('journal_entries.csv');
    return entries.filter((e: any) => e.user_id === userId);
  },

  async updateJournalEntry(entryId: number, content: string, mood: string) {
    const entries = readCSV('journal_entries.csv');
    const entry = entries.find((e: any) => e.id === entryId);
    if (entry) {
      entry.content = content;
      entry.mood = mood;
      entry.updated_at = new Date().toISOString();
      writeCSV('journal_entries.csv', entries);
    }
  },
};

// Mood log operations
export const moodLogOperations = {
  async createMoodLog(userId: number, mood: string, notes: string) {
    const logs = readCSV('mood_logs.csv');
    const newLog = {
      id: logs.length + 1,
      user_id: userId,
      mood,
      notes,
      created_at: new Date().toISOString(),
    };
    logs.push(newLog);
    writeCSV('mood_logs.csv', logs);
    return newLog;
  },

  async getMoodLogs(userId: number) {
    const logs = readCSV('mood_logs.csv');
    return logs.filter((l: any) => l.user_id === userId);
  },
};

// Chatbot history operations
export const chatbotOperations = {
  async saveMessage(userId: number, message: string, isUser: boolean) {
    const history = readCSV('chatbot_history.csv');
    const newMessage = {
      id: history.length + 1,
      user_id: userId,
      message,
      is_user: isUser,
      created_at: new Date().toISOString(),
    };
    history.push(newMessage);
    writeCSV('chatbot_history.csv', history);
    return newMessage;
  },

  async getChatHistory(userId: number) {
    const history = readCSV('chatbot_history.csv');
    return history.filter((h: any) => h.user_id === userId);
  },
}; 