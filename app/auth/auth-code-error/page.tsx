export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e40af] flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">
          Authentication Error
        </h2>
        <p className="text-gray-600 mb-6">
          There was a problem with your authentication. This could be due to an
          expired link or a configuration issue.
        </p>
        <div className="space-y-3">
          <a
            href="/auth/signin"
            className="block w-full bg-[#1e40af] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            Try Signing In Again
          </a>
          <a
            href="/auth/signup"
            className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Create New Account
          </a>
        </div>
      </div>
    </div>
  );
}
