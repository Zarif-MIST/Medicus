import React from 'react';
import { Stethoscope, Pill, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ChooseRoleSection() {
  const roles = [
    {
      title: 'Doctors',
      description: 'Manage patients and Doctors. Check Patient Records, Prescribe Medicines.',
      icon: Stethoscope,
      color: 'from-red-600 to-red-800',
    },
    {
      title: 'Pharmacy',
      description: 'View Patient Prescription. See & Manage Stocks. Dispense Medication.',
      icon: Pill,
      color: 'from-red-600 to-red-800',
    },
    {
      title: 'Patient',
      description: 'Manage patients and Doctors. Check Patient Records, Prescribe Medicines.',
      icon: User,
      color: 'from-red-600 to-red-800',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-red-700">Roles</span>
          </h2>
          <p className="text-xl text-gray-600">
            Access your personalized Dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-gray-900 border-0 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative p-10 text-center text-white">
                {/* Icon with minimal glow effect on hover */}
                <div className="mb-8 flex justify-center">
                  <div className="p-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <role.icon size={64} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-4">{role.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-10">
                  {role.description}
                </p>

                {/* Button with subtle lift */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-3/4 mx-auto rounded-full bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  Start
                </Button>
              </div>

              {/* Minimal bottom glow accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}