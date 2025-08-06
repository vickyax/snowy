
const processStepsMap = {
  "TV, Smart Tv Repair": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Wifi Router": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Plumbing Installation, Repair - Major": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Repair", "duration": "2-6 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "RO Water Purifier": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Service/Repair", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Dishwasher": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Printers / Scanners": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Setup", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "CCTV Installation, Services": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Service", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Batteries / UPS": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Service", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "AC Installation, Service": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Refrigerator / Fridge Services": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Laptop and PC": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Annual Maintenance": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "1 hr" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Maintenance", "duration": "2-4 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Electrician": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Installation", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Washing Machine Repair": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Electricial Installation": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Smart Home Installations": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Lighting Installations": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Ventillation Installation, Services": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Service", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Plumbing Services - Minor": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Drywall repair and maintenance": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Minor electrical": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Carpentry": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Construction", "duration": "1-4 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Solar Panel Installation, Services": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "1 hr" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Service", "duration": "3-6 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Operating System Installation & Upgrade": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "15 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Upgrade", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Antivirus & Security Software Installation": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "15 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation", "duration": "30 min-1 hr" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Driver Installation & Updates": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "15 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Installation/Update", "duration": "30 min-1 hr" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Data Backup & Recovery": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Backup/Recovery", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Printer/Scanner Software Setup": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "15 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Setup", "duration": "30 min-1 hr" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Annual Maintenance Contract (AMC)": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "1 hr" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Maintenance", "duration": "2-4 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Appliance Maintenance": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Maintenance", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "General Home Health Check": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "1 hr" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Maintenance/Fixes", "duration": "2-4 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Roof & Waterproofing Maintenance": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "1 hr" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Maintenance", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Workstation & Furniture Assembly": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Assembly", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Office Electrical Maintenance": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Inspection", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Repair/Maintenance", "duration": "1-3 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ],
  "Networking & IT Setup": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔍", "title": "Site Assessment", "duration": "45 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Setup", "duration": "2-5 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "30 min" }
  ],
  "Printer & Office Equipment Setup": [
    { "icon": "📅", "title": "Book Slot", "duration": "2 hrs" },
    { "icon": "🔧", "title": "Diagnosis", "duration": "30 min" },
    { "icon": "💵", "title": "Approval", "duration": "Instant" },
    { "icon": "🛠️", "title": "Setup", "duration": "1-2 hrs" },
    { "icon": "✅", "title": "Completion", "duration": "15 min" }
  ]
};


const ServiceProcess = ({ service }) => {
  const steps = processStepsMap[service] || [];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Service Process</h3>
      <div className="flex justify-between  overflow-auto ">
        {steps.map((step, i) => (
          <div key={i} className="text-center m-2  w-1/5">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
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
