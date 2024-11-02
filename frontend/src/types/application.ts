export interface SearchParams {
  keyword?: string;
  status?: string;
}

export interface Application {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface DecodedToken {
  id: string;
  role: "staff" | "public";
}
