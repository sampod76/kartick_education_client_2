import PackageOptions from '@/components/package/PackageOption';

export default function PackagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect educational plan tailored to your child&rsquo;s grade level
            and learning needs
          </p>
        </div>
        <PackageOptions />
      </div>
    </div>
  );
}
