import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  // Generic server error
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}

// Example usage in an API route
// export async function GET(request: Request) {
//   try {
//     // Your logic here
//     if (!hasPermission()) {
//       throw new ApiError(403, "Access Forbidden");
//     }
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
