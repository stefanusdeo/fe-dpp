export interface ApiResponse<T> {
  Data: any;
  Message: string;
  Status: "success" | "error"; // bisa disesuaikan jika ada status lain
  StatusCode: number;
}
