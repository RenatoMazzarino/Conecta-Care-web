export type Patient = {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  avatarHint: string;
  familyContact: {
    name: string;
    phone: string;
  };
};

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  stock: number;
  lowStockThreshold: number;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
