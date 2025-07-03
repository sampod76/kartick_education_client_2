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

// 'use client';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { useState } from 'react';

// const plans = {
//   '6-12': [
//     { type: 'Subscription', price: '$85/month', note: '50% off 1st month' },
//     { type: 'One Year', price: '$765/year', note: '≈ $65.75/month' },
//     {
//       type: 'Lifetime',
//       price: 'We’ve Got You',
//       note: 'Sibling Discount Applied',
//       email: 'hello@iblossomlearn-academy.org',
//     },
//   ],
//   'K-5': [
//     { type: 'Subscription', price: '$65/month', note: '50% off 1st month' },
//     { type: 'One Year', price: '$585/year', note: '≈ $48.75/month' },
//     {
//       type: 'Lifetime',
//       price: 'We’ve Got You',
//       note: 'Sibling Discount Applied',
//       email: 'hello@iblossomlearn-academy.org',
//     },
//   ],
// };

// type PlanKey = '6-12' | 'K-5';

// export default function PackageOptions() {
//   const [selectedPlan, setSelectedPlan] = useState<{
//     grade: PlanKey;
//     type: string;
//   } | null>(null);

//   const handleSelect = (grade: PlanKey, type: string) => {
//     setSelectedPlan({ grade, type });
//   };

//   const isSelected = (grade: PlanKey, type: string) =>
//     selectedPlan?.grade === grade && selectedPlan?.type === type;

//   return (
//     <div className="p-6 space-y-6 max-w-4xl mx-auto">
//       <div className="bg-green-100 text-green-800 text-center p-2 rounded-md font-semibold text-sm">
//         🎓 Registration Fee: $185 (Annual Testing fees included)
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {(['6-12', 'K-5'] as PlanKey[]).map((grade) => (
//           <Card key={grade} className="border shadow-lg rounded-2xl">
//             <CardContent className="space-y-4 p-6">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">
//                   {grade === '6-12' ? '6–12th Grade' : 'K–5th Grade'}
//                 </h3>
//                 <Badge>{grade === '6-12' ? 'Middle/High School' : 'Elementary'}</Badge>
//               </div>

//               <div className="grid grid-cols-1 gap-4">
//                 {plans[grade].map((opt) => (
//                   <div
//                     key={opt.type}
//                     className={`cursor-pointer border rounded-xl p-4 transition ${
//                       isSelected(grade, opt.type)
//                         ? 'bg-blue-100 border-blue-500'
//                         : 'bg-white border-gray-300 hover:bg-gray-50'
//                     }`}
//                     onClick={() => handleSelect(grade, opt.type)}
//                   >
//                     <p className="text-lg font-semibold">{opt.type}</p>
//                     <p className="text-sm">{opt.price}</p>
//                     <p className="text-xs text-gray-600">{opt.note}</p>
//                     {opt.email && (
//                       <p className="text-xs text-gray-500 pt-2 border-t border-black">
//                         📧 {opt.email}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {selectedPlan && (
//         <div className="text-center text-sm text-gray-700 mt-4">
//           ✅ You selected: <strong>{selectedPlan.type}</strong> from{' '}
//           <strong>
//             {selectedPlan.grade === '6-12' ? '6–12th Grade' : 'K–5th Grade'}
//           </strong>
//         </div>
//       )}
//     </div>
//   );
// }
