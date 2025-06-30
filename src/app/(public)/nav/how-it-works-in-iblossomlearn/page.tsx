/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
// 'use client';
// import React from 'react';

// const HowItWorks: React.FC = () => {
//   const steps = [
//     {
//       icon: '🎓',
//       title: '1. Choose Your Grade Level',
//       desc: 'Select the grade that aligns with your child’s current level. Our globally aligned curriculum meets students where they are.',
//     },
//     {
//       icon: '📝',
//       title: '2. Register & Pay the Assessment Fee',
//       desc: (
//         <>
//           Complete registration and pay a one-time annual fee of <strong>$185</strong>.
//           Includes:
//           <ul className="list-disc ml-6 mt-2 text-left">
//             <li>Three MAP® Growth assessments</li>
//             <li>Comprehensive progress reports</li>
//             <li>A full MindPrint Learning profile</li>
//           </ul>
//           <a href="#" className="inline-block mt-2 text-blue-600 hover:underline">
//             📘 Learn more: MindPrint Learning
//           </a>
//         </>
//       ),
//     },
//     {
//       icon: '📊',
//       title: '3. Initial Placement Assessment',
//       desc: 'Students take an internal test to determine placement in core subjects.',
//     },
//     {
//       icon: '🧠',
//       title: '4. Personalized Learning Path',
//       desc: 'Each student receives a personalized path blending academic rigor and cultural relevance.',
//     },
//     {
//       icon: '⏳',
//       title: '5. Day 10: MAP® Growth Assessment',
//       desc: 'Ten days post enrollment, the first MAP® Growth test helps establish learning baselines.',
//     },
//     {
//       icon: '🔍',
//       title: '6. MindPrint Cognitive Assessment',
//       desc: 'Provides insights into executive function, memory, attention, and more.',
//     },
//     {
//       icon: '🧭',
//       title: '7. Guided Support with Certified Educators',
//       desc: 'Teachers monitor progress, engage in live sessions, and ensure no student learns alone.',
//     },
//     {
//       icon: '📈',
//       title: '8. Two Additional MAP® Assessments',
//       desc: 'Progress is tracked through the year with additional MAP® tests and detailed family reports.',
//     },
//   ];

//   return (
//     <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-16">
//       <div className="max-w-7xl mx-auto text-center">
//         <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
//           🌱 How It Works: Your Journey with iBLossomLearn
//         </h2>
//         <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
//           At iBLossomLearn Academy, we believe education should recognize the whole
//           child—their strengths, challenges, interests, and aspirations.
//         </p>
//       </div>

//       <div className="space-y-12 max-w-5xl mx-auto">
//         {steps.map((step, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-2xl shadow p-6 flex items-start gap-4"
//           >
//             <div className="text-3xl">{step.icon}</div>
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
//               <p className="text-gray-600 mt-1">{step.desc}</p>
//             </div>
//           </div>
//         ))}

//         <div className="bg-blue-100 rounded-2xl p-6 shadow mt-12 text-center">
//           <h3 className="text-2xl font-bold text-blue-900 mb-2">
//             💼 Enrollment Options & Family Support
//           </h3>
//           <p className="text-blue-800">
//             <strong>💳 Flexible Subscriptions:</strong> Choose between Monthly or Annual
//             Plan (discounted).
//             <br />
//             Sibling discounts available for multi-child families.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;
import {
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  FileText,
  GraduationCap,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';

// Custom Badge Component
const Badge = ({ children, className = '', ...props }: any) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 ${className}`}
    {...props}
  >
    {children}
  </span>
);

// Custom Button Component
const Button = ({
  children,
  className = '',
  size = 'default',
  variant = 'default',
  ...props
}: any) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
  };

  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900',
  };

  return (
    <button
      //@ts-ignore
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Card Components
import React from 'react';

type CardProps = React.PropsWithChildren<{
  className?: string;
  [key: string]: any;
}>;

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const SinglePage = () => {
  const steps = [
    {
      icon: GraduationCap,
      title: 'Choose Your Grade Level',
      description:
        "Select the grade that aligns with your child's current level. Whether entering elementary, middle, or high school, our globally aligned curriculum meets students where they are.",
      color: 'bg-blue-500',
      number: '1',
    },
    {
      icon: FileText,
      title: 'Register & Pay the Assessment Fee',
      description:
        'Families complete registration and pay a one-time annual assessment fee of $185, which includes all three MAP® Growth assessments, comprehensive progress reports, and a full MindPrint Learning profile.',
      color: 'bg-green-500',
      number: '2',
    },
    {
      icon: BarChart3,
      title: 'Initial Placement Assessment',
      description:
        'After registration, students take an internal placement test to determine starting points in core subjects.',
      color: 'bg-purple-500',
      number: '3',
    },
    {
      icon: Brain,
      title: 'Personalized Learning Path',
      description:
        'We assign each student a learning pathway that blends academic rigor with cultural relevance—aligned with their unique abilities and goals.',
      color: 'bg-orange-500',
      number: '4',
    },
    {
      icon: Clock,
      title: 'Day 10: MAP® Growth Assessment',
      description:
        'Ten days post-matriculation, students take their first MAP® Growth test to establish a baseline. This adaptive, research-backed tool helps us pinpoint strengths, gaps, and growth potential.',
      color: 'bg-red-500',
      number: '5',
    },
    {
      icon: Search,
      title: 'MindPrint Cognitive Assessment',
      description:
        'Students receive a MindPrint Learning profile, which explores their executive functions, memory, attention, and processing speed—enhancing our ability to personalize support.',
      color: 'bg-indigo-500',
      number: '6',
    },
    {
      icon: Users,
      title: 'Guided Support with Certified Educators',
      description:
        'Every learner is paired with a certified teacher who monitors progress weekly, engages in live sessions as needed, and collaborates with families to adjust instruction and boost motivation.',
      color: 'bg-teal-500',
      number: '7',
    },
    {
      icon: TrendingUp,
      title: 'Two Additional MAP® Growth Assessments',
      description:
        'Throughout the school year, students take two additional MAP® assessments to track academic progress and refine their personalized learning plan. Families receive detailed reports each time.',
      color: 'bg-pink-500',
      number: '8',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <GraduationCap size={48} className="text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                iBLossomLearn
              </span>
              <br />
              Academy
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Education that recognizes the whole child—their strengths, challenges,
              interests, and aspirations
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition hover:scale-105"
              >
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold rounded-full"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
                <p className="text-blue-100">
                  Tailored instruction for every student's unique needs
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Certified Educators</h3>
                <p className="text-blue-100">Expert guidance from qualified teachers</p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Programs</h3>
                <p className="text-blue-100">
                  Choose from monthly or annual enrollment options
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L50 105C100 90 200 60 300 45C400 30 500 30 600 37.5C700 45 800 60 900 67.5C1000 75 1100 75 1150 75L1200 75V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">🌱 How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Journey with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                iBLossomLearn
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At iBLossomLearn Academy, we believe education should recognize the whole
              child—their strengths, challenges, interests, and aspirations. Our flexible
              program ensures each student begins with clarity, receives tailored
              instruction, and grows with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`${step.color} p-4 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent size={32} />
                        </div>
                        <div className="mt-3 text-2xl font-bold text-gray-400 text-center">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                📘 Learn More About MindPrint Learning
              </h3>
              <p className="text-gray-600 mb-6">
                Discover how our cognitive assessment tools provide deep insights into
                your child's learning style and potential.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Explore MindPrint Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Options Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              💼 Enrollment Options
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Flexible Plans &
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {' '}
                Family Support
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your family, with special discounts for
              siblings.
            </p>
          </div>
          <div className="bg-blue-100 rounded-2xl p-6 shadow mt-12 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              💼 Enrollment Options & Family Support
            </h3>
            <p className="text-blue-800">
              <strong>💳 Flexible Subscriptions:</strong> Choose between Monthly or Annual
              Plan (discounted).
              <br />
              Sibling discounts available for multi-child families.
            </p>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <CreditCard className="text-blue-600" size={32} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Assessment Fee
                </CardTitle>
                <div className="text-4xl font-bold text-blue-600">$185</div>
                <p className="text-gray-500">One-time annual fee</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    All three MAP® Growth assessments
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Comprehensive progress reports
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Full MindPrint Learning profile
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Cognitive insights & analysis
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Calendar className="text-green-600" size={32} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Monthly Plan
                </CardTitle>
                <div className="text-4xl font-bold text-green-600">Flexible</div>
                <p className="text-gray-500">Pay month by month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Month-to-month flexibility
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Cancel anytime
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    All program features
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Certified educator support
                  </li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Choose Monthly
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Best Value
              </span>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Users className="text-orange-600" size={32} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Annual Plan
                </CardTitle>
                <div className="text-4xl font-bold text-orange-600">Discounted</div>
                <p className="text-gray-500">Save with annual payment</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Significant cost savings
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Full year commitment
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    All program features
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-3" size={20} />
                    Priority educator support
                  </li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  Choose Annual
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default SinglePage;
