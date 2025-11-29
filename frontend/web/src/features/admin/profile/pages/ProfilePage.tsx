const ProfilePage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-grey-900 mb-1">Admin Profile</h1>
        <p className="text-sm text-grey-500">
          Manage your admin account settings
        </p>
      </div>

      <div className="bg-gradient-to-br from-gold-pale to-white rounded-xl border border-grey-200 p-12 text-center">
        <div className="w-20 h-20 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-grey-900 mb-2">
          Admin Profile Management
        </h2>
        <p className="text-grey-600 mb-6 max-w-md mx-auto">
          The comprehensive admin profile page with advanced features is coming soon. 
          For now, please use the seller profile as a reference.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-gold font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Development in progress
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
