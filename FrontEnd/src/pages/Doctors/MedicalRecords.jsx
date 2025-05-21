import { useState } from 'react';

export default function CaseHistoryTemplate() {
  const currentDateFormatted = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const [formData, setFormData] = useState({
    caseNo: '615190',
    opd: 'Speech OPD',
    regDate: '25/02/2025',
    name: 'NIVAAN KISHORE',
    gender: 'Male',
    age: '11 yrs 5 mths',
    dob: '20/09/2013',
    residentialAddress: [
      'S/O YADAVENDRA SHYAM KISHORE',
      'IRIS 901, SUYOG NISARG, LOHEGAON ROAD,',
      'WAGHOLI, -412207',
      'PUNE, MAHARASTRA',
      'INDIA'
    ],
    mobile: '9353839192',
    email: '',
    education: 'III',
    occupation: 'Primary education',
    incomeSlab: 'Nil Self',
    refFrom: '',
    language: 'HINDI',
    religion: 'Hindu',
    otherLanguage: 'ENGLISH',
    familyMembers: [
      { relation: 'Father', name: 'Yadavendra Shyam Kishore', age: '43', education: 'Post graduate', occupation: 'Software manager' },
      { relation: 'Mother', name: 'Juhi Roy', age: '43', education: 'Post graduate', occupation: 'Home maker' },
      { relation: 'Guardian', name: '', age: '', education: '', occupation: '' }
    ],
    presentComplaint: 'Poor Expressive Language skills, Inadequate Speech & Language, Difficulty in sentence formation; difficulty in communicating in a social situation.',
    duration: 'NA',
    nature: 'Developmental',
    onset: 'Gradual',
    onsetType: 'NA',
    purposeOfVisit: 'Routine evaluation',
    medicalHistory: 'Absent',
    associatedProblems: 'Reduced attention and concentration, Poor socialization skills',
    developmentalHistory: 'Speech milestone: Delayed, Motor milestone: Normal',
    educationalHistory: 'Normal school',
    familyType: 'Nuclear',
    siblingHistory: 'nil',
    consanguinity: 'Absent',
    otherFamilyHistory: 'Nil',
    earlierInvestigation: 'The child has been tested in Chandrashekar Institute, Bangalore (2016) and assessment has been done in the district hospital of Pune (Jan 2024) and the child is diagnosed with Autism Spectrum Disorder with Moderate Intellectual Disability. They have reserved the UDID card for the same from the district hospital of Pune.',
    recommendations: [
      'Speech Language Evaluation',
      'Clinical Psychology Consultation',
      'Physiotherapy/Occupational therapy Consultation'
    ],
    studentClinician: 'Mr.TCPD1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      
      if (grandchild) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [grandchild]: value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updatedFamilyMembers = [...formData.familyMembers];
    updatedFamilyMembers[index] = {
      ...updatedFamilyMembers[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      familyMembers: updatedFamilyMembers
    });
  };

  const handleResidentialAddressChange = (index, value) => {
    const updatedAddress = [...formData.residentialAddress];
    updatedAddress[index] = value;
    
    setFormData({
      ...formData,
      residentialAddress: updatedAddress
    });
  };

  const handleRecommendationChange = (index, value) => {
    const updatedRecommendations = [...formData.recommendations];
    updatedRecommendations[index] = value;
    
    setFormData({
      ...formData,
      recommendations: updatedRecommendations
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const InputField = ({ label, name, value, onChange, className = "" }) => (
    <div className={`mb-2 medical-input-container ${className}`}>
      <span className="medical-label font-semibold">{label}:</span>{" "}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="medical-input border-b-2 border-gray-400 focus:outline-none focus:border-blue-600 transition-colors print:bg-transparent print:border-none print:p-0 w-auto"
      />
    </div>
  );

  const TextareaField = ({ label, name, value, onChange, className = "" }) => (
    <div className={`mb-3 medical-textarea-container ${className}`}>
      <div className="medical-label font-semibold mb-1">{label}:</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="medical-textarea w-full border-2 border-gray-400 rounded-md p-2 focus:outline-none focus:border-blue-600 transition-colors print:bg-transparent print:border-none print:p-0 print:leading-tight text-sm"
        rows="3"
      />
    </div>
  );

  return (
    <div className="medical-form-container flex flex-col min-h-screen bg-gray-50">
      <div className="p-6 bg-blue-50 print:bg-white medical-header print:hidden mb-6 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-blue-800">Case History Template</h1>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="medical-print-btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Print Case History
          </button>
        </div>
      </div>
      
      <div className="medical-form-content px-10 py-6 max-w-5xl mx-auto w-full text-sm border-2 border-gray-300 rounded-lg my-4 bg-white shadow-md">
        {/* Header Information */}
        <div className="mb-8 medical-section border-b-2 border-gray-300 pb-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="medical-header-left">
              <InputField label="Case No" name="caseNo" value={formData.caseNo} onChange={handleChange} />
              <InputField label="OPD" name="opd" value={formData.opd} onChange={handleChange} />
              <InputField label="Reg Date" name="regDate" value={formData.regDate} onChange={handleChange} />
            </div>
            <div className="medical-header-right">
              <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
              <InputField label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
              <div className="mb-2 flex gap-4">
                <InputField 
                  label="Age" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange}
                  className="w-[30px]" 
                />
                <InputField 
                  label="DOB" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange}
                  className="w-[30px]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-2 gap-6 mb-8 medical-section border-b-2 border-gray-300 pb-6">
          <div className="medical-address-left">
            <p className="medical-label font-semibold mb-2">Residential Address</p>
            {formData.residentialAddress.map((line, index) => (
              <input
                key={index}
                type="text"
                value={line}
                onChange={(e) => handleResidentialAddressChange(index, e.target.value)}
                className="medical-input w-full border-b-2 border-gray-400 mb-2 focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0"
              />
            ))}
          </div>
          <div className="medical-address-right">
            <p className="medical-label font-semibold mb-2">Communication Address</p>
            <InputField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
            <InputField label="Education" name="education" value={formData.education} onChange={handleChange} />
            <InputField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
            <InputField label="Income Slab" name="incomeSlab" value={formData.incomeSlab} onChange={handleChange} />
            <InputField label="Ref. From" name="refFrom" value={formData.refFrom} onChange={handleChange} />
            <InputField label="Language" name="language" value={formData.language} onChange={handleChange} />
            <InputField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          </div>
        </div>

        {/* Family Information */}
        <div className="mb-8 medical-section border-b-2 border-gray-300 pb-6">
          <div className="grid grid-cols-4 gap-3 medical-family-header font-semibold mb-3 text-sm">
            <div>Family Member</div>
            <div>Name/Age</div>
            <div>Education</div>
            <div>Occupation</div>
          </div>
          {formData.familyMembers.map((member, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 mb-2 text-sm medical-family-row">
              <div className="medical-family-cell">{member.relation}</div>
              <input
                type="text"
                value={`${member.name}${member.age ? ' / ' + member.age : ''}`}
                onChange={(e) => {
                  const value = e.target.value;
                  const parts = value.split('/');
                  handleFamilyMemberChange(index, 'name', parts[0]?.trim() || '');
                  handleFamilyMemberChange(index, 'age', parts[1]?.trim() || '');
                }}
                className="medical-input border-b-2 border-gray-400 focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0 w-[250px]"
              />
              <input
                type="text"
                value={member.education}
                onChange={(e) => handleFamilyMemberChange(index, 'education', e.target.value)}
                className="medical-input border-b-2 border-gray-400 focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0 w-[250px]"
              />
              <input
                type="text"
                value={member.occupation}
                onChange={(e) => handleFamilyMemberChange(index, 'occupation', e.target.value)}
                className="medical-input border-b-2 border-gray-400 focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0 w-[250px]"
              />
            </div>
          ))}
          <InputField 
            label="Other language known" 
            name="otherLanguage" 
            value={formData.otherLanguage} 
            onChange={handleChange}
            className="mt-3" 
          />
        </div>

        {/* Declaration */}
        <div className="mb-8 medical-section border-b-2 border-gray-300 pb-6 text-sm">
          <p className="medical-label font-semibold mb-3">Declaration:</p>
          <ol className="list-decimal pl-6 mb-3">
            <li>I hereby declare that the information furnished above is true to the best of my knowledge.</li>
            <li>I hereby consent and authorize the institute to release the clinical information to clinical/academic/research and legal purpose.</li>
            <li>I agree to pay the charges for the institute promptly in accordance with the regular rates and terms of the institute.</li>
          </ol>
          <div className="mb-4">
            <p className="medical-label font-semibold">General instructions:</p>
            <ol className="list-decimal pl-6">
              <li>We would like to thank you for visiting us. This is for your kind information that all the activities in the department of clinical services are monitored through close circuit television (CCTV).</li>
              <li>The institute shall not be liable for loss or damage of personal belongings of the clients and such belongings in the institute shall be at client own risk. The caregivers/parents are requested to take care of their children at the department.</li>
            </ol>
          </div>
          <div className="flex justify-between items-center medical-declaration-footer">
            <div>
              <p>Date: <input
                type="text"
                value={formData.regDate}
                onChange={(e) => setFormData({...formData, regDate: e.target.value})}
                className="medical-input border-b-2 border-gray-400 focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0"
              /></p>
            </div>
            <div>
              <p className="medical-label font-semibold">Signature/Thumb Impression of Client</p>
              <div className="h-6 w-32 border-b-2 border-black"></div>
            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="mb-8 medical-section">
          <h2 className="text-base medical-label font-bold mb-3 uppercase border-b-2 border-gray-400 pb-2">Present Complaint</h2>
          <TextareaField
            name="presentComplaint"
            value={formData.presentComplaint}
            onChange={handleChange}
          />
          
          <div className="text-sm mb-3 grid grid-cols-2 gap-3 medical-clinical-details">
            <InputField label="Duration" name="duration" value={formData.duration} onChange={handleChange} />
            <InputField label="Nature" name="nature" value={formData.nature} onChange={handleChange} />
            <InputField label="Onset" name="onset" value={formData.onset} onChange={handleChange} />
            <InputField label="Onset type" name="onsetType" value={formData.onsetType} onChange={handleChange} />
          </div>
          
          <InputField 
            label="Purpose of Visit" 
            name="purposeOfVisit" 
            value={formData.purposeOfVisit} 
            onChange={handleChange}
            className="text-sm mb-4" 
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Medical History</h2>
          <TextareaField
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Associated Problems</h2>
          <TextareaField
            name="associatedProblems"
            value={formData.associatedProblems}
            onChange={handleChange}
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Personal History</h2>
          <TextareaField
            label="1. Developmental History"
            name="developmentalHistory"
            value={formData.developmentalHistory}
            onChange={handleChange}
          />
          <TextareaField
            label="2. Educational History"
            name="educationalHistory"
            value={formData.educationalHistory}
            onChange={handleChange}
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Family History</h2>
          <InputField 
            label="1. Family type" 
            name="familyType" 
            value={formData.familyType} 
            onChange={handleChange}
            className="text-sm" 
          />
          <InputField 
            label="2. Sibling history" 
            name="siblingHistory" 
            value={formData.siblingHistory} 
            onChange={handleChange}
            className="text-sm" 
          />
          <InputField 
            label="3. Consanguinity" 
            name="consanguinity" 
            value={formData.consanguinity} 
            onChange={handleChange}
            className="text-sm" 
          />
          <InputField 
            label="4. Any other relevant family history" 
            name="otherFamilyHistory" 
            value={formData.otherFamilyHistory} 
            onChange={handleChange}
            className="text-sm mb-3" 
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Earlier Investigation, Diagnosis and Treatment</h2>
          <TextareaField
            name="earlierInvestigation"
            value={formData.earlierInvestigation}
            onChange={handleChange}
          />
          
          <h2 className="text-base medical-label font-bold mt-4 mb-3 uppercase border-b-2 border-gray-400 pb-2">Recommendations</h2>
          {formData.recommendations.map((rec, index) => (
            <input
              key={index}
              type="text"
              value={rec}
              onChange={(e) => handleRecommendationChange(index, e.target.value)}
              className="medical-input w-full border-b-2 border-gray-400 mb-2 text-sm focus:outline-none focus:border-blue-600 print:bg-transparent print:border-none print:p-0"
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 medical-footer border-t-2 border-gray-300 pt-6 text-sm">
          <div className="grid grid-cols-2 gap-6">
            <div className="medical-footer-left">
              <InputField label="Case No" name="caseNo" value={formData.caseNo} onChange={handleChange} />
              <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
              <InputField label="Age" name="age" value={formData.age} onChange={handleChange} />
              <InputField label="Date" name="regDate" value={formData.regDate} onChange={handleChange} />
            </div>
            <div className="medical-footer-right">
              <p>{currentDateFormatted} (IST)</p>
              <div className="flex gap-4">
                <InputField 
                  label="Gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-[20px]" 
                />
                <InputField 
                  label="Slab" 
                  name="slab" 
                  value="III" 
                  onChange={(e) => {}}
                  className="w-[20px]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="medical-label font-semibold">Student Clinician</p>
                  <InputField 
                    name="studentClinician" 
                    value={formData.studentClinician} 
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="medical-label font-semibold">Supervising SLP</p>
                  <p>This is an electronically generated record, hence does not require a signature; and, is intended for record-keeping within AIISH.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media screen {
          .medical-form-container {
            background-color: #f7fafc;
          }
          .medical-header {
            background-color: #e6f3ff;
          }
          .medical-input, .medical-textarea {
            transition: border-color 0.3s ease;
          }
          .medical-print-btn:hover {
            transform: translateY(-1px);
          }
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 10pt;
            line-height: 1.2;
            color: #000;
          }
          
          @page {
            margin: 1.5cm;
            size: portrait;
          }
          
          .medical-form-container {
            background: none !important;
          }
          
          .medical-header {
            display: none !important;
          }
          
          .medical-form-content {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: none !important;
          }
          
          .medical-input, .medical-textarea {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            font-size: 10pt !important;
            line-height: 1.2 !important;
            color: #000 !important;
            width: auto !important;
            min-width: 100px !important;
          }
          
          .medical-textarea {
            white-space: pre-wrap !important;
            overflow: hidden !important;
          }
          
          .medical-section {
            page-break-inside: avoid;
          }
          
          .medical-label {
            color: #000 !important;
            font-weight: 600 !important;
          }
          
          .medical-family-row, .medical-clinical-details {
            page-break-inside: avoid;
          }
          
          .medical-footer {
            page-break-before: avoid;
          }
        }
      `}</style>
    </div>
  );
}
