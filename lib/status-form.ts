export type StatusForm = {
  sukses?: boolean;
  galat?: Record<string, string[] | undefined>;
  pesan?: string;
  nilai?: Record<string, string | undefined>;
};
