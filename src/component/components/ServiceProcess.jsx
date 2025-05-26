
const processStepsMap = {
  'AC Repair': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ]
 ,
  'Laptop and PC': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ],
  
  'Refrigerator': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ],
  'Tv Repair': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ],
  'Washing Machine': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ],
  'Wifi Router': [
    { icon: '📅', title: 'Book Slot', duration: '2 hrs' },
    { icon: '🔧', title: 'Diagnosis', duration: '30 min' },
    { icon: '💵', title: 'Approval', duration: 'Instant' },
    { icon: '🛠️', title: 'Repair', duration: '1-3 hrs' },
    { icon: '✅', title: 'Completion', duration: '15 min' }
  ]
};


const ServiceProcess = ({ service }) => {
  const steps = processStepsMap[service] || [];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Service Process</h3>
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={i} className="text-center w-1/5">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              {step.icon}
            </div>
            <p className="text-sm font-medium">{step.title}</p>
            <p className="text-xs text-gray-500">{step.duration}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block h-0.5 bg-gray-200 mt-5 w-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProcess;
