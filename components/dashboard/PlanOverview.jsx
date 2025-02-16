export default function PlanOverview() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-rose-100 via-purple-100 to-blue-200 p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/25 text-gray-700">
            CURRENT PLAN
          </span>
        </div>
        <button className="inline-flex items-center px-4 py-2 rounded-lg bg-white/25 text-sm font-medium text-gray-700 hover:bg-white/30 transition-all">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Manage Plan
        </button>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Researcher</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">API Usage</span>
            <span className="text-sm text-gray-600">0/1,000 Credits</span>
          </div>
          <div className="h-2 bg-white/25 rounded-full overflow-hidden">
            <div className="h-2 bg-white/40 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 