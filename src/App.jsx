import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  User,
  Home,
  Calendar,
  ChevronLeft,
  ChevronDown,
  Mail,
  Plus,
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Folder,
  Shield,
  Key,
  LogOut,
  RefreshCw,
  Award,
  CreditCard,
  BookOpen,
  MapPin,
  TrendingUp,
  Download,
  Send,
  Edit2,
  Paperclip,
  Upload
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, messages, notifications, profile, menu
  const [subTab, setSubTab] = useState('All'); // All, Circulars, Resources, Planners
  const [currentView, setCurrentView] = useState('main'); // main, personal_info
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // notice_detail, chat_detail, compose_msg, attendance, timetable, gradecard, gatepass, fee_history, duty_leave, settings_item, edit_profile
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [chatType, setChatType] = useState('staff');
  const [subView, setSubView] = useState(null); // staff_messages, messages_empty, circulars_list, session_view, privacy_view, change_password_view
  const [detailReturnView, setDetailReturnView] = useState(null); // where circular_detail back should go
  const [selectedSession, setSelectedSession] = useState('JulDec2026');

  // Duty / Medical Leave form state
  const [leaveTab, setLeaveTab] = useState('apply'); // apply | history
  const [leaveType, setLeaveType] = useState('Duty Leave');
  const [leaveCategory, setLeaveCategory] = useState('3D printing workshop');
  const [leaveEventName, setLeaveEventName] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveTimeSlot, setLeaveTimeSlot] = useState('Full Day');
  const [leaveAttachmentName, setLeaveAttachmentName] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);

  // Editable Student Info State with localStorage persistence
  const [studentName, setStudentName] = useState(() => localStorage.getItem('cuapp_studentName') || 'OM AGGARWAL');
  const [rollNumber, setRollNumber] = useState(() => localStorage.getItem('cuapp_rollNumber') || '2410990653');
  const [semesterInfo, setSemesterInfo] = useState(() => localStorage.getItem('cuapp_semesterInfo') || '2024-BE-CSE-5 SEM 5 SEM');
  const [dobInfo, setDobInfo] = useState(() => localStorage.getItem('cuapp_dobInfo') || '02-08-2006');
  const [mobileNumber, setMobileNumber] = useState(() => localStorage.getItem('cuapp_mobileNumber') || '9780647351');
  const [emailInfo, setEmailInfo] = useState(() => localStorage.getItem('cuapp_emailInfo') || 'om0653.becse24@chitkara.edu.in');
  const [bloodGroup, setBloodGroup] = useState(() => localStorage.getItem('cuapp_bloodGroup') || 'B+');
  const [fatherName, setFatherName] = useState(() => localStorage.getItem('cuapp_fatherName') || 'Mr. Amit Aggarwal');
  const [motherName, setMotherName] = useState(() => localStorage.getItem('cuapp_motherName') || 'Mrs. Swati Aggarwal');
  const [addressInfo, setAddressInfo] = useState(() => localStorage.getItem('cuapp_addressInfo') || '#314 Vikas Nagar, Rajpura Near Ntc School, Rajpura, Punjab,140401');
  const [studentPhoto, setStudentPhoto] = useState(() => localStorage.getItem('cuapp_studentPhoto') || '/om_profile.jpg');

  // Temporary edit form state
  const [editFormName, setEditFormName] = useState(studentName);
  const [editFormRoll, setEditFormRoll] = useState(rollNumber);
  const [editFormSem, setEditFormSem] = useState(semesterInfo);
  const [editFormDob, setEditFormDob] = useState(dobInfo);
  const [editFormMobile, setEditFormMobile] = useState(mobileNumber);
  const [editFormEmail, setEditFormEmail] = useState(emailInfo);
  const [editFormBlood, setEditFormBlood] = useState(bloodGroup);
  const [editFormFather, setEditFormFather] = useState(fatherName);
  const [editFormMother, setEditFormMother] = useState(motherName);
  const [editFormAddress, setEditFormAddress] = useState(addressInfo);
  const [editFormPhoto, setEditFormPhoto] = useState(studentPhoto);

  // Clock state for realistic mobile header
  const [currentTime, setCurrentTime] = useState('9:24');

  // Auth state — app always opens on Timeline; institute login only after Profile → Logout
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginStep, setLoginStep] = useState(null); // 'login' | 'onboarding' | null
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [accountPassword, setAccountPassword] = useState(
    () => localStorage.getItem('cuapp_accountPassword') || 'Phoenix.ash12'
  );
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Timeline read-state (missing before → blank page crash)
  const [readNoticeIds, setReadNoticeIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cuapp_readNoticeIds') || '[]');
    } catch {
      return [];
    }
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      setLoginError('Please enter your Username / Roll Number');
      return;
    }
    if (loginPassword !== accountPassword) {
      setLoginError('Invalid password! Please try again.');
      return;
    }
    setLoginError('');
    const userRoll = loginUsername.trim();
    setRollNumber(userRoll);
    localStorage.setItem('cuapp_rollNumber', userRoll);

    setEditFormName(studentName);
    setEditFormRoll(userRoll);
    setEditFormSem(semesterInfo);
    setEditFormDob(dobInfo);
    setEditFormMobile(mobileNumber);
    setEditFormEmail(emailInfo);
    setEditFormFather(fatherName);
    setEditFormMother(motherName);
    setEditFormAddress(addressInfo);
    setEditFormBlood(bloodGroup);
    setEditFormPhoto(studentPhoto);

    setLoginStep('onboarding');
  };

  const handleChangePassword = () => {
    setPasswordChangeError('');
    if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setPasswordChangeError('Please fill all password fields.');
      return;
    }
    if (oldPasswordInput !== accountPassword) {
      setPasswordChangeError('Old password is incorrect.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New password and confirm password do not match.');
      return;
    }
    const hasUpper = /[A-Z]/.test(newPasswordInput);
    const hasLower = /[a-z]/.test(newPasswordInput);
    const hasNumber = /[0-9]/.test(newPasswordInput);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPasswordInput);
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setPasswordChangeError('Password must include uppercase, lowercase, number and special character.');
      return;
    }
    setAccountPassword(newPasswordInput);
    localStorage.setItem('cuapp_accountPassword', newPasswordInput);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordChangeError('');
    alert('Password changed successfully!');
    setSubView(null);
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    setStudentName(editFormName);
    setRollNumber(editFormRoll);
    setSemesterInfo(editFormSem);
    setDobInfo(editFormDob);
    setMobileNumber(editFormMobile);
    setEmailInfo(editFormEmail);
    setBloodGroup(editFormBlood);
    setFatherName(editFormFather);
    setMotherName(editFormMother);
    setAddressInfo(editFormAddress);
    if (editFormPhoto) {
      setStudentPhoto(editFormPhoto);
      localStorage.setItem('cuapp_studentPhoto', editFormPhoto);
    }

    localStorage.setItem('cuapp_studentName', editFormName);
    localStorage.setItem('cuapp_rollNumber', editFormRoll);
    localStorage.setItem('cuapp_semesterInfo', editFormSem);
    localStorage.setItem('cuapp_dobInfo', editFormDob);
    localStorage.setItem('cuapp_mobileNumber', editFormMobile);
    localStorage.setItem('cuapp_emailInfo', editFormEmail);
    localStorage.setItem('cuapp_bloodGroup', editFormBlood);
    localStorage.setItem('cuapp_fatherName', editFormFather);
    localStorage.setItem('cuapp_motherName', editFormMother);
    localStorage.setItem('cuapp_addressInfo', editFormAddress);
    localStorage.setItem('cuapp_isLoggedIn', 'true');

    setIsLoggedIn(true);
    setLoginStep(null);
    setActiveTab('timeline');
    setCurrentView('main');
    setSubView(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('cuapp_isLoggedIn');
    setIsLoggedIn(false);
    setLoginStep('login');
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordChangeError('');
    setActiveTab('timeline');
    setCurrentView('main');
    setSubView(null);
    setActiveModal(null);
  };

  // Temporary Toast / Under-button confirmation message state
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmKey, setConfirmKey] = useState('');

  const triggerConfirm = (key, msg, action = null) => {
    setConfirmKey(key);
    setConfirmMsg(msg);
    setTimeout(() => {
      setConfirmMsg('');
      setConfirmKey('');
      if (action) action();
    }, 1000);
  };

  // Container scroll ref to auto-scroll to top on view change
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [subView, activeTab, currentView]);

  // Long press timer ref
  const timerRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  // Long Press Handlers
  const handlePressStart = (e) => {
    timerRef.current = setTimeout(() => {
      openEditModal();
    }, 600); // 600ms long press trigger
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Helper to generate unique attachment names per circular title
  const getAttachmentName = (item) => {
    if (item.attachmentName) return item.attachmentName;
    const words = item.title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 4);
    const cleanName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_');
    return `${cleanName || 'Attachment'}.pdf`;
  };

  const openNoticeDetail = (item, returnView = null) => {
    const itemId = item.id || item.title;
    if (!readNoticeIds.includes(itemId)) {
      const updated = [...readNoticeIds, itemId];
      setReadNoticeIds(updated);
      localStorage.setItem('cuapp_readNoticeIds', JSON.stringify(updated));
    }
    setSelectedNotice({
      title: item.title,
      snippet: item.snippet || item.content,
      attachmentName: getAttachmentName(item)
    });
    setDetailReturnView(returnView);
    setSubView('circular_detail');
  };

  const openEditModal = () => {
    setEditFormName(studentName);
    setEditFormRoll(rollNumber);
    setEditFormSem(semesterInfo);
    setEditFormDob(dobInfo);
    setEditFormMobile(mobileNumber);
    setEditFormEmail(emailInfo);
    setEditFormBlood(bloodGroup);
    setEditFormFather(fatherName);
    setEditFormMother(motherName);
    setEditFormAddress(addressInfo);
    setEditFormPhoto(studentPhoto);
    setActiveModal('edit_profile');
  };

  const saveProfileEdits = (e) => {
    if (e) e.preventDefault();
    setStudentName(editFormName);
    setRollNumber(editFormRoll);
    setSemesterInfo(editFormSem);
    setDobInfo(editFormDob);
    setMobileNumber(editFormMobile);
    setEmailInfo(editFormEmail);
    setBloodGroup(editFormBlood);
    setFatherName(editFormFather);
    setMotherName(editFormMother);
    setAddressInfo(editFormAddress);
    if (editFormPhoto) {
      setStudentPhoto(editFormPhoto);
      localStorage.setItem('cuapp_studentPhoto', editFormPhoto);
    }

    localStorage.setItem('cuapp_studentName', editFormName);
    localStorage.setItem('cuapp_rollNumber', editFormRoll);
    localStorage.setItem('cuapp_semesterInfo', editFormSem);
    localStorage.setItem('cuapp_dobInfo', editFormDob);
    localStorage.setItem('cuapp_mobileNumber', editFormMobile);
    localStorage.setItem('cuapp_emailInfo', editFormEmail);
    localStorage.setItem('cuapp_bloodGroup', editFormBlood);
    localStorage.setItem('cuapp_fatherName', editFormFather);
    localStorage.setItem('cuapp_motherName', editFormMother);
    localStorage.setItem('cuapp_addressInfo', editFormAddress);

    setActiveModal(null);
  };

  // Notice items matching exact screenshots
  const notices = [
    {
      id: 1,
      type: 'Circular',
      isNew: false,
      title: 'Notice (Re-appear Examinations, November - December 2026)',
      snippet: 'Notice (Re-appear Examinations, November - December 2026) for BE CSE batch 2024-2028.',
      date: '05-10-2026',
      content: 'This is to inform all students that registrations for Re-appear Examinations for November - December 2026 are now open on the Chalkpad ERP portal. Please verify your subject codes and submit the fee before 20th October 2026.'
    },
    {
      id: 2,
      type: 'Circular',
      isNew: true,
      title: 'RE-EVALUATION RESULT BCA BATCH 2024 AND 2025 MAY 2026',
      snippet: 'The RE -EVALUATION result(s) of the following program has been declared;1. BCA BATCH 2024 2ND SEM RP RE-EVALUATION...',
      date: '30-09-2026',
      content: 'The Re-evaluation results for BCA Batch 2024 & 2025 2nd Semester Examination held in May 2026 have been officially declared. Students can check updated grade sheets under the Grade Card section.'
    },
    {
      id: 3,
      type: 'Circular',
      isNew: true,
      title: 'BE CSE Batch 2024-2028 Revised Student Groups & Timetable',
      snippet: 'Revised student group allocations and updated weekly lecture schedule for 5th Semester Computer Science students.',
      date: '28-09-2026',
      content: 'The academic coordinator has released revised lab groups and tutorial batches for BE CSE 5th Semester. All lectures will strictly follow the new block allocation effective from Monday.'
    },
    {
      id: 4,
      type: 'Circular',
      isNew: true,
      title: 'Placement Drive 2027: Campus Recruitment & Pre-Talk Registration',
      snippet: 'Mandatory pre-placement talk and portal registration instructions for 3rd and 4th year engineering students.',
      date: '26-09-2026',
      content: 'All eligible students registering for upcoming campus placement drives must complete their profile verification on the Training & Placement Cell portal before October 15, 2026.'
    },
    {
      id: 5,
      type: 'Resource',
      isNew: false,
      title: 'Operating Systems & System Programming E-Books & Lab Manuals',
      snippet: 'Download official lab reference manuals, UNIX shell scripting assignments, and lecture notes.',
      date: '25-09-2026',
      content: 'Access essential reference materials for CSE-501 (Operating Systems). Includes process scheduling simulator code, memory management case studies, and deadlock detection algorithms.'
    },
    {
      id: 6,
      type: 'Circular',
      isNew: false,
      title: 'Mid-Semester Examination Date Sheet Announcement (Odd Sem 2026)',
      snippet: 'Detailed date sheet and seating arrangement plan for 3rd, 5th, and 7th semester mid-term exams.',
      date: '24-09-2026',
      content: 'Mid-term examinations will commence from November 15, 2026. Hall tickets will be downloadable via Chalkpad ERP starting November 8th. No student will be allowed without ID card.'
    },
    {
      id: 7,
      type: 'Circular',
      isNew: false,
      title: 'Submission of Duty & Medical Leave Applications for August 2026',
      snippet: 'Deadline for submitting duty leave certificates and hospital medical slips for attendance reconciliation.',
      date: '22-09-2026',
      content: 'Students who missed classes due to sports events or medical reasons must upload verified certificates via the Duty/Medical Leave menu before September 30, 2026.'
    },
    {
      id: 8,
      type: 'Planner',
      isNew: false,
      title: 'Academic Calendar & Mid-Term Exam Schedule (Odd Sem 2026)',
      snippet: 'Official mid-semester examination date sheet and project submission deadlines.',
      date: '20-09-2026',
      content: 'The 5th Semester Mid-Term evaluations are scheduled between 15th November and 24th November 2026. Detailed seating plan and admit card generation link will be activated 5 days prior.'
    },
    {
      id: 9,
      type: 'Circular',
      isNew: false,
      title: 'Annual Tech Fest "InnovateX 2026" Hackathon Registrations Open',
      snippet: '24-hour national level hackathon and robotics competition open for all engineering disciplines.',
      date: '18-09-2026',
      content: 'Registrations are open for InnovateX 2026 Hackathon! Winners will receive cash prizes worth ₹ 2.5 Lakhs and direct interview opportunities with leading technology partners.'
    },
    {
      id: 10,
      type: 'Circular',
      isNew: false,
      title: 'Hostel Night Out & Gatepass Clearance Guidelines Update',
      snippet: 'Important updates regarding online gatepass approvals, local guardian verification, and curfew timings.',
      date: '15-09-2026',
      content: 'Hostel resident students applying for weekend leave or night out gatepass must submit requests 24 hours prior. Automated SMS alerts will be dispatched to registered guardian numbers.'
    },
    {
      id: 11,
      type: 'Circular',
      isNew: false,
      title: 'Central Library Book Return & Digital Repository Access Renewal',
      snippet: 'Clearance procedure for borrowed central library books and digital repository access renewal.',
      date: '12-09-2026',
      content: 'All students with overdue library books are requested to return them to avoid daily fines. Digital e-journal credentials will remain active throughout the examination session.'
    },
    {
      id: 12,
      type: 'Resource',
      isNew: false,
      title: 'Database Management Systems (DBMS) SQL Lab Exercises & Quiz Solutions',
      snippet: 'Practice SQL queries, ER diagrams, normalization notes, and previous year question banks.',
      date: '10-09-2026',
      content: 'Lab reference manual and SQL query practice sets uploaded for CSE-502. Solutions to week 1-6 laboratory assignments are available for self-assessment.'
    },
    {
      id: 13,
      type: 'Circular',
      isNew: false,
      title: 'Fee Payment Deadline Notice for Odd Semester 2026-2027',
      snippet: 'Final notification for pending semester fee installment submissions without late fee penalty.',
      date: '08-09-2026',
      content: 'Students who have not yet cleared their 5th semester tuition fees must complete payment on or before September 20, 2026 to maintain active portal registration.'
    },
    {
      id: 14,
      type: 'Circular',
      isNew: false,
      title: 'Special Workshop on Cloud Computing & AWS Architecture',
      snippet: '2-day hands-on AWS Cloud Practitioner training organized by the Department of Computer Science.',
      date: '05-09-2026',
      content: 'Department of CSE is organizing a hands-on workshop on AWS Cloud Architecture on 12th & 13th September. Certificates of participation will be issued by AWS Academy.'
    },
    {
      id: 15,
      type: 'Circular',
      isNew: false,
      title: 'Student Experience & Campus Facilities Survey 2026-27',
      snippet: 'Mandatory online survey regarding academic delivery, lab equipment, hostel food, and transport.',
      date: '02-09-2026',
      content: 'Your feedback matters! Complete the Student Experience Survey via your student menu tab before September 15th to help us improve campus infrastructure and learning outcomes.'
    },
    {
      id: 16,
      type: 'Circular',
      isNew: false,
      title: 'Blood Donation & Social Welfare Drive by NSS Student Club',
      snippet: 'Voluntary blood donation camp and community health checkup organized at University Health Centre.',
      date: '30-08-2026',
      content: 'NSS Student Unit is hosting a mega Blood Donation Camp on September 5th. Donors will be awarded NSS certificates and donor cards.'
    },
    {
      id: 17,
      type: 'Resource',
      isNew: false,
      title: 'Computer Networks & Security Architecture Lecture Slides & PPTs',
      snippet: 'Download lecture presentations for TCP/IP protocols, OSI layers, and cryptographic algorithms.',
      date: '27-08-2026',
      content: 'Course materials for CSE-503 (Computer Networks) covering Units 1 to 3 have been uploaded. Includes Wireshark packet capture practical guides.'
    },
    {
      id: 18,
      type: 'Circular',
      isNew: false,
      title: 'Teachers Day Celebration & Cultural Evening Performance',
      snippet: 'Invitation for student performances, faculty honors, and evening cultural gala at Main Auditorium.',
      date: '25-08-2026',
      content: 'Teachers Day celebrations will take place on September 5th at 3:00 PM in the University Auditorium. All students are cordially invited.'
    },
    {
      id: 19,
      type: 'Planner',
      isNew: false,
      title: 'Sports Meet & Annual Athletic Championship 2026 Schedule',
      snippet: 'Inter-departmental cricket, football, basketball, and track event registrations.',
      date: '20-08-2026',
      content: 'Annual Athletic Meet registration is now open. Team captains must submit squad lists to the Sports Office by September 10th.'
    },
    {
      id: 20,
      type: 'Circular',
      isNew: false,
      title: 'Anti-Ragging Squad Committee Guidelines & Emergency Helpline',
      snippet: 'Zero-tolerance policy statement, squad contact details, and emergency grievance portal.',
      date: '15-08-2026',
      content: 'Chitkara University maintains a strict zero-tolerance policy towards ragging. Emergency anti-ragging squad contacts and national helpline numbers are posted across all blocks.'
    },
    {
      id: 21,
      type: 'Circular',
      isNew: true,
      title: 'CSE Batch 2023 Revised Student Groups & Time Table w.e.f. 28.09.2026',
      snippet: "Dear Students, Please find attached Revised Student's list w.e.f. 28.09.2026 for CSE Batch 2023. -- Thanks & Regards",
      date: '28-09-2026',
      content: "Dear Students, Please find attached Revised Student's list w.e.f. 28.09.2026 for CSE Batch 2023. -- Thanks & Regards"
    },
    {
      id: 22,
      type: 'Circular',
      isNew: true,
      title: 'RE-APPEAR RE-EVALUATION RESULT OF BCA BATCH 2022 MAY 2026',
      snippet: 'The Re-evaluation results of the following programs are declared; 1. BCA BATCH 2022 2ND, 4TH AND 6TH SEM RP REVEAL MAY 2026',
      date: '28-09-2026',
      content: 'The Re-evaluation results of the following programs are declared; 1. BCA BATCH 2022 2ND, 4TH AND 6TH SEM RP REVEAL MAY 2026'
    },
    {
      id: 23,
      type: 'Circular',
      isNew: true,
      title: 'Notice regarding ST-2 of Gateway To Japan-II, Intermediate Japanese (CSE, Batch-2023)',
      snippet: 'Dear Students Kindly see the attached Notice regarding ST-2 of Gateway To Japan-II, Intermediate Japanese (CSE, Batch-2023).',
      date: '27-09-2026',
      content: 'Dear Students Kindly see the attached Notice regarding ST-2 of Gateway To Japan-II, Intermediate Japanese (CSE, Batch-2023).'
    },
    {
      id: 24,
      type: 'Circular',
      isNew: true,
      title: 'Morning DJ | New Feature Added for the Freshers 2026',
      snippet: "Responding to the demand from our Day Scholar students, we're adding a Morning DJ Experience to SPOKEN! Because the celebrations shouldn't wait for the evening.",
      date: '26-09-2026',
      content: "Responding to the demand from our Day Scholar students, we're adding a Morning DJ Experience to SPOKEN! Because the celebrations shouldn't wait for the evening."
    },
    {
      id: 25,
      type: 'Circular',
      isNew: false,
      title: 'Notice for Rudiments of AI Reappear Examination September 2026',
      snippet: 'Notice for Rudiments of AI Reappear Examination September 2026',
      date: '25-09-2026',
      content: 'Notice for Rudiments of AI Reappear Examination September 2026. Students must report 30 minutes before the scheduled start time with admit card and ID.'
    },
    {
      id: 26,
      type: 'Planner',
      isNew: true,
      title: 'Updated Timetable CUIET- AE, Fall Semester 2026',
      snippet: 'Updated Timetable CUIET- AE, Fall Semester 2026 effective from the next academic week.',
      date: '23-09-2026',
      content: 'Updated Timetable CUIET- AE, Fall Semester 2026. All AE students must follow the revised classroom and lab allocations.'
    },
    {
      id: 27,
      type: 'Circular',
      isNew: true,
      title: 'Seating Plan 23.09.2026 Morning Session',
      snippet: 'Seating Plan 23.09.2026 Morning Session',
      date: '22-09-2026',
      content: 'Seating Plan 23.09.2026 Morning Session. Please check your room number and seat allocation carefully before reporting.'
    },
    {
      id: 28,
      type: 'Circular',
      isNew: false,
      title: 'Notice Regarding ST-1 of Network Security and Cryptography (CSE Batch 2024)',
      snippet: 'Notice Regarding ST-1 of Network Security and Cryptography for CSE Batch 2024.',
      date: '22-09-2026',
      content: 'Notice Regarding ST-1 of Network Security and Cryptography (CSE Batch 2024). Syllabus coverage and exam timing are mentioned in the attached PDF.'
    },
    {
      id: 29,
      type: 'Circular',
      isNew: false,
      title: 'Seating Plan 21.09.2026 Morning & Evening Session',
      snippet: 'Seating Plan 21.09.2026 Morning & Evening Session',
      date: '20-09-2026',
      content: 'Seating Plan 21.09.2026 Morning & Evening Session. Students are advised to arrive early and verify hall numbers.'
    },
    {
      id: 30,
      type: 'Circular',
      isNew: false,
      title: 'CSE Batch 2023 Semester 7 Revised Student Groups and Timetable w.e.f. 19.9.2026',
      snippet: 'Dear Students Please find attached file with this mail for CSE Batch 2023 Revised Student Groups and Timetable of w.e.f. 21.09.2026. Thanks & Regards',
      date: '19-09-2026',
      content: 'Dear Students Please find attached file with this mail for CSE Batch 2023 Revised Student Groups and Timetable of w.e.f. 21.09.2026. Thanks & Regards'
    },
    {
      id: 31,
      type: 'Circular',
      isNew: false,
      title: 'RE-APPEAR RESULT OF BE CSE AIML AND AIFT BATCH 2024 2ND SEM SWAYAM SUBJECTS',
      snippet: 'The Re-appear results of the following programs are declared; 1. BE CSE AIML & AIFT BATCH 2024 (SWAYAM SUBJECTS) 2ND SEM MAY 2026',
      date: '18-09-2026',
      content: 'The Re-appear results of the following programs are declared; 1. BE CSE AIML & AIFT BATCH 2024 (SWAYAM SUBJECTS) 2ND SEM MAY 2026'
    },
    {
      id: 32,
      type: 'Circular',
      isNew: false,
      title: 'RE-APPEAR RESULT OF BE AE BATCH 2024 2ND SEM MAY 2026',
      snippet: 'The Re-appear results of the following programs are declared; 1. BE AE BATCH 2024 2ND SEM MAY 2026',
      date: '18-09-2026',
      content: 'The Re-appear results of the following programs are declared; 1. BE AE BATCH 2024 2ND SEM MAY 2026'
    },
    {
      id: 33,
      type: 'Resource',
      isNew: true,
      title: 'Software Engineering Unit Notes, SRS Templates & Case Studies',
      snippet: 'Download SRS templates, UML diagrams, and previous year ST-1/ST-2 question papers for Software Engineering.',
      date: '17-09-2026',
      content: 'Course resources for Software Engineering including SRS templates, UML practice sheets, and case-study PDFs are now available under Resources.'
    },
    {
      id: 34,
      type: 'Resource',
      isNew: false,
      title: 'Java Programming Lab Manual & Practice Assignments (CSE-5)',
      snippet: 'Complete Java lab manual with JDBC, collections, and multithreading practice sets.',
      date: '16-09-2026',
      content: 'Java Programming Lab Manual & Practice Assignments for CSE 5th Semester. Submit weekly lab files before the next evaluation.'
    },
    {
      id: 35,
      type: 'Planner',
      isNew: true,
      title: 'Odd Semester 2026 Academic Planner & Important Deadlines',
      snippet: 'Complete planner covering MST, end-term, project reviews, and festival holidays.',
      date: '15-09-2026',
      content: 'Odd Semester 2026 Academic Planner & Important Deadlines. Keep this planner for assignment and exam preparation tracking.'
    },
    {
      id: 36,
      type: 'Circular',
      isNew: false,
      title: 'Notice Regarding ST-1 of Design & Analysis of Algorithms (Batch 2024)',
      snippet: 'ST-1 schedule, syllabus units, and seating instructions for DAA subject.',
      date: '14-09-2026',
      content: 'Notice Regarding ST-1 of Design & Analysis of Algorithms (Batch 2024). Students must bring scientific calculator if permitted by the subject teacher.'
    },
    {
      id: 37,
      type: 'Circular',
      isNew: false,
      title: 'Internship Completion Certificate Upload Deadline – Sept 2026',
      snippet: 'All summer internship certificates must be uploaded on Chalkpad before the mentioned deadline.',
      date: '13-09-2026',
      content: 'Internship Completion Certificate Upload Deadline – Sept 2026. Incomplete profiles may face delay in NOC / placement registration.'
    },
    {
      id: 38,
      type: 'Resource',
      isNew: false,
      title: 'Machine Learning Lab Datasets & Jupyter Notebook Starters',
      snippet: 'Starter notebooks for regression, classification, and clustering experiments.',
      date: '12-09-2026',
      content: 'Machine Learning Lab Datasets & Jupyter Notebook Starters uploaded for CSE ML elective batches.'
    },
    {
      id: 39,
      type: 'Planner',
      isNew: false,
      title: '5th Semester Project Review Schedule (Phase-1 & Phase-2)',
      snippet: 'Department-wise project review slots for CSE, AIML, and AIFT batches.',
      date: '11-09-2026',
      content: '5th Semester Project Review Schedule (Phase-1 & Phase-2). Teams must bring PPT, abstract, and weekly progress report.'
    },
    {
      id: 40,
      type: 'Circular',
      isNew: true,
      title: 'Seating Plan 12.09.2026 Evening Session – Block A & B',
      snippet: 'Evening session seating plan for Block A and Block B examination halls.',
      date: '11-09-2026',
      content: 'Seating Plan 12.09.2026 Evening Session – Block A & B. Check seat numbers carefully; wrong hall entry will not be permitted.'
    },
    {
      id: 41,
      type: 'Circular',
      isNew: false,
      title: 'Notice: Gateway To Japan-I Makeup Class Schedule (Batch 2024)',
      snippet: 'Makeup classes for Intermediate Japanese Module-I scheduled this weekend.',
      date: '10-09-2026',
      content: 'Notice: Gateway To Japan-I Makeup Class Schedule (Batch 2024). Attendance is mandatory for registered students.'
    },
    {
      id: 42,
      type: 'Resource',
      isNew: false,
      title: 'Web Technologies HTML/CSS/JS Mini-Project Starter Kits',
      snippet: 'Frontend starter kits, bootstrap templates, and evaluation rubrics.',
      date: '09-09-2026',
      content: 'Web Technologies HTML/CSS/JS Mini-Project Starter Kits are available for download under Resources tab.'
    },
    {
      id: 43,
      type: 'Planner',
      isNew: false,
      title: 'Cultural Fest Audition & Rehearsal Planner – Oct 2026',
      snippet: 'Dance, music, drama, and fashion show audition slots with venue mapping.',
      date: '08-09-2026',
      content: 'Cultural Fest Audition & Rehearsal Planner – Oct 2026. Register your team through the student activities portal.'
    },
    {
      id: 44,
      type: 'Circular',
      isNew: false,
      title: 'RE-APPEAR RESULT OF BCA BATCH 2023 4TH SEM MAY 2026',
      snippet: 'The Re-appear results of BCA Batch 2023 4th Semester May 2026 are declared.',
      date: '07-09-2026',
      content: 'The Re-appear results of the following programs are declared; 1. BCA BATCH 2023 4TH SEM MAY 2026'
    },
    {
      id: 45,
      type: 'Circular',
      isNew: false,
      title: 'Notice Regarding Library Orientation for First Year Students',
      snippet: 'Mandatory library orientation sessions for Batch 2026 students.',
      date: '06-09-2026',
      content: 'Notice Regarding Library Orientation for First Year Students. Slot booking link is available on the student portal.'
    },
    {
      id: 46,
      type: 'Resource',
      isNew: true,
      title: 'Compiler Design Lecture Notes & Parsing Practice Sheets',
      snippet: 'Lexical analysis notes, CFG practice, and LR parsing worksheets.',
      date: '05-09-2026',
      content: 'Compiler Design Lecture Notes & Parsing Practice Sheets uploaded for advanced CSE electives.'
    },
    {
      id: 47,
      type: 'Planner',
      isNew: true,
      title: 'Placement Season Roadmap – Resume, Aptitude & Mock Interviews',
      snippet: 'Week-wise planner for aptitude drills, coding rounds, and HR mock sessions.',
      date: '04-09-2026',
      content: 'Placement Season Roadmap – Resume, Aptitude & Mock Interviews. Follow the weekly milestones for better readiness.'
    },
    {
      id: 48,
      type: 'Circular',
      isNew: false,
      title: 'Notice: Industrial Visit Permission Forms Submission',
      snippet: 'Students going for industrial visit must submit guardian consent forms.',
      date: '03-09-2026',
      content: 'Notice: Industrial Visit Permission Forms Submission. Forms without guardian signature will be rejected.'
    },
    {
      id: 49,
      type: 'Circular',
      isNew: false,
      title: 'Updated Bus Route Timing for Day Scholars – Sep 2026',
      snippet: 'Revised pickup and drop timings for Tri-city day scholar routes.',
      date: '02-09-2026',
      content: 'Updated Bus Route Timing for Day Scholars – Sep 2026. Students should report 5 minutes early at designated stops.'
    },
    {
      id: 50,
      type: 'Resource',
      isNew: false,
      title: 'Python for Data Science Notebooks & Assignment Solutions (Week 1-4)',
      snippet: 'NumPy, Pandas, Matplotlib practice notebooks with sample outputs.',
      date: '01-09-2026',
      content: 'Python for Data Science Notebooks & Assignment Solutions (Week 1-4) are available under Resources.'
    },
    {
      id: 51,
      type: 'Planner',
      isNew: false,
      title: 'Hostel Mess Menu & Weekly Nutrition Planner – Sep 2026',
      snippet: 'Breakfast, lunch, snacks, and dinner menu planner for hostel residents.',
      date: '31-08-2026',
      content: 'Hostel Mess Menu & Weekly Nutrition Planner – Sep 2026. Feedback can be shared with mess committee representatives.'
    },
    {
      id: 52,
      type: 'Circular',
      isNew: true,
      title: 'Notice Regarding ST-2 of Operating Systems (CSE Batch 2024)',
      snippet: 'ST-2 syllabus, date, and seating instructions for Operating Systems.',
      date: '30-08-2026',
      content: 'Notice Regarding ST-2 of Operating Systems (CSE Batch 2024). Focus units are mentioned in the attached circular.'
    },
    {
      id: 53,
      type: 'Circular',
      isNew: false,
      title: 'RE-EVALUATION RESULT OF BE CSE BATCH 2023 4TH SEM MAY 2026',
      snippet: 'Re-evaluation results declared for BE CSE Batch 2023 4th Semester May 2026.',
      date: '29-08-2026',
      content: 'The Re-evaluation results of the following programs are declared; 1. BE CSE BATCH 2023 4TH SEM MAY 2026'
    },
    {
      id: 54,
      type: 'Resource',
      isNew: false,
      title: 'Cloud Computing Lab Guide – AWS Free Tier Experiments',
      snippet: 'Step-by-step EC2, S3, and Lambda lab experiments for cloud elective.',
      date: '28-08-2026',
      content: 'Cloud Computing Lab Guide – AWS Free Tier Experiments. Do not share access keys publicly during submissions.'
    },
    {
      id: 55,
      type: 'Planner',
      isNew: false,
      title: 'Research Paper Writing Workshop Planner – Sept/Oct 2026',
      snippet: 'Sessions on abstract writing, IEEE format, plagiarism check, and publication ethics.',
      date: '27-08-2026',
      content: 'Research Paper Writing Workshop Planner – Sept/Oct 2026. Priority seats for final-year project teams.'
    },
    {
      id: 56,
      type: 'Circular',
      isNew: false,
      title: 'Seating Plan 26.08.2026 Morning Session – Examination Block C',
      snippet: 'Morning session seating plan for Examination Block C.',
      date: '25-08-2026',
      content: 'Seating Plan 26.08.2026 Morning Session – Examination Block C. Mobile phones are strictly prohibited inside halls.'
    },
    {
      id: 57,
      type: 'Circular',
      isNew: false,
      title: 'Notice for Value Added Course Registration (VAC Fall 2026)',
      snippet: 'Registration open for Full Stack, Data Analytics, and Prompt Engineering VAC courses.',
      date: '24-08-2026',
      content: 'Notice for Value Added Course Registration (VAC Fall 2026). Limited seats; first-come first-served.'
    },
    {
      id: 58,
      type: 'Resource',
      isNew: true,
      title: 'Cyber Security Lab Tools Setup & Capture-the-Flag Basics',
      snippet: 'VM setup guide, Wireshark filters, and beginner CTF challenge pack.',
      date: '23-08-2026',
      content: 'Cyber Security Lab Tools Setup & Capture-the-Flag Basics uploaded for registered students.'
    },
    {
      id: 59,
      type: 'Planner',
      isNew: false,
      title: 'NSS Activity Calendar & Community Service Hours Tracker',
      snippet: 'Month-wise NSS activity calendar with mandatory hour requirements.',
      date: '22-08-2026',
      content: 'NSS Activity Calendar & Community Service Hours Tracker. Upload proof of participation after each event.'
    },
    {
      id: 60,
      type: 'Circular',
      isNew: false,
      title: 'Notice Regarding Parent-Teacher Meeting (Odd Sem 2026)',
      snippet: 'PTM schedule for 3rd and 5th semester students with mentor allocation.',
      date: '21-08-2026',
      content: 'Notice Regarding Parent-Teacher Meeting (Odd Sem 2026). Mentors will share individual slots via email.'
    },
    {
      id: 61,
      type: 'Circular',
      isNew: true,
      title: 'Updated Timetable CSE Cluster Gamma – w.e.f. 20.08.2026',
      snippet: 'Revised classroom and lab slots for CSE Cluster Gamma students.',
      date: '20-08-2026',
      content: 'Updated Timetable CSE Cluster Gamma – w.e.f. 20.08.2026. Please follow the latest attached timetable only.'
    },
    {
      id: 62,
      type: 'Resource',
      isNew: false,
      title: 'Discrete Mathematics Tutorial Sheets & Solution Keys',
      snippet: 'Graph theory, combinatorics, and logic tutorial sheets with answer keys.',
      date: '19-08-2026',
      content: 'Discrete Mathematics Tutorial Sheets & Solution Keys available for self-practice before ST-2.'
    },
    {
      id: 63,
      type: 'Planner',
      isNew: true,
      title: 'Hackathon Prep Planner – InnovateX Warm-up Challenges',
      snippet: '7-day prep planner with DSA topics, UI wireframes, and pitch checklist.',
      date: '18-08-2026',
      content: 'Hackathon Prep Planner – InnovateX Warm-up Challenges. Complete daily tasks before the main event.'
    },
    {
      id: 64,
      type: 'Circular',
      isNew: false,
      title: 'Notice: ID Card Reissue & Lost Card Affidavit Process',
      snippet: 'Process and fee details for reissuing damaged or lost university ID cards.',
      date: '17-08-2026',
      content: 'Notice: ID Card Reissue & Lost Card Affidavit Process. Apply through student services desk with required documents.'
    },
    {
      id: 65,
      type: 'Circular',
      isNew: false,
      title: 'RE-APPEAR FORM FILLING NOTICE – NOV/DEC 2026 SESSION',
      snippet: 'Online re-appear form filling and fee payment schedule for Nov/Dec 2026.',
      date: '16-08-2026',
      content: 'RE-APPEAR FORM FILLING NOTICE – NOV/DEC 2026 SESSION. Late fee will apply after the portal closing date.'
    },
    {
      id: 66,
      type: 'Resource',
      isNew: false,
      title: 'Artificial Intelligence Unit-2 Slides & Case Study Pack',
      snippet: 'Search algorithms, knowledge representation, and expert system case studies.',
      date: '15-08-2026',
      content: 'Artificial Intelligence Unit-2 Slides & Case Study Pack uploaded for theory + tutorial practice.'
    },
    {
      id: 67,
      type: 'Planner',
      isNew: false,
      title: 'End Semester Practical Exam Slot Planner (Odd Sem 2026)',
      snippet: 'Batch-wise practical exam slots for labs across CSE departments.',
      date: '14-08-2026',
      content: 'End Semester Practical Exam Slot Planner (Odd Sem 2026). Report 15 minutes early with lab record and ID card.'
    },
    {
      id: 68,
      type: 'Circular',
      isNew: true,
      title: 'Notice Regarding ST-1 of Database Management Systems',
      snippet: 'ST-1 date, syllabus, and important instructions for DBMS.',
      date: '13-08-2026',
      content: 'Notice Regarding ST-1 of Database Management Systems. Bring your own stationery; sharing is not allowed.'
    },
    {
      id: 69,
      type: 'Circular',
      isNew: false,
      title: 'Campus Cleanliness Drive & Plastic-Free Week Announcement',
      snippet: 'Student volunteers invited for plastic-free campus campaign.',
      date: '12-08-2026',
      content: 'Campus Cleanliness Drive & Plastic-Free Week Announcement. NSS and Eco Club volunteers will get activity certificates.'
    },
    {
      id: 70,
      type: 'Resource',
      isNew: false,
      title: 'Mobile App Development Flutter Starter Project & Rubric',
      snippet: 'Flutter starter app, UI checklist, and viva evaluation rubric.',
      date: '11-08-2026',
      content: 'Mobile App Development Flutter Starter Project & Rubric available under Resources for elective students.'
    },
    {
      id: 71,
      type: 'Planner',
      isNew: false,
      title: 'Mentor Meeting Weekly Slot Planner – Aug/Sep 2026',
      snippet: 'Mentor-wise weekly counseling slots for academic and career guidance.',
      date: '10-08-2026',
      content: 'Mentor Meeting Weekly Slot Planner – Aug/Sep 2026. Book your slot at least one day in advance.'
    }
  ];

  // Exactly 49 Circular items matching the "You have 49 new Circulars" badge
  const allCircularsList = [
    { title: 'RE-EVALUATION RESULT BCA BATCH 2024 AND 2025 MAY 2026', snippet: 'The RE -EVALUATION result(s) of the following program has been declared;1. BCA BATCH 2024 2ND SEM RP RE-EVALUATION...', dateGroup: 'Sep 30, Wednesday' },
    { title: 'CSE Batch 2023 Revised Student Groups & Time Table w.e.f. 28.09.2026', snippet: "Dear Students, Please find attached Revised Student's list w.e.f. 28.09.2026 for CSE Batch 2023. -- Thanks & Regards", dateGroup: 'Sep 28, Monday' },
    { title: 'RE-APPEAR RE-EVALUATION RESULT OF BCA BATCH 2022 MAY 2026', snippet: 'The Re-evaluation results of the following programs are declared; 1. BCA BATCH 2022 2ND, 4TH AND 6TH SEM RP REVEAL MAY 2026', dateGroup: 'Sep 28, Monday' },
    { title: 'Morning DJ | New Feature Added for Student Engagement', snippet: 'Dear Students, A new Morning DJ interactive audio streaming feature is now live on Chalkpad ERP portal.', dateGroup: 'Sep 25, Friday' },
    { title: 'Notice (Re-appear Examinations, November - December 2026)', snippet: 'Notice (Re-appear Examinations, November - December 2026) for BE CSE batch 2024-2028.', dateGroup: 'Sep 24, Thursday' },
    { title: 'BE CSE Batch 2024-2028 Revised Student Groups & Timetable', snippet: 'Revised student group allocations and updated weekly lecture schedule for 5th Semester Computer Science students.', dateGroup: 'Sep 22, Tuesday' },
    { title: 'Placement Drive 2027: Campus Recruitment & Pre-Talk Registration', snippet: 'Mandatory pre-placement talk and portal registration instructions for 3rd and 4th year engineering students.', dateGroup: 'Sep 20, Sunday' },
    { title: 'Mid-Semester Examination Date Sheet Announcement (Odd Sem 2026)', snippet: 'Detailed date sheet and seating arrangement plan for 3rd, 5th, and 7th semester mid-term exams.', dateGroup: 'Sep 18, Friday' },
    { title: 'Submission of Duty & Medical Leave Applications for August 2026', snippet: 'Deadline for submitting duty leave certificates and hospital medical slips for attendance reconciliation.', dateGroup: 'Sep 15, Tuesday' },
    { title: 'Annual Tech Fest "InnovateX 2026" Hackathon Registrations Open', snippet: '24-hour national level hackathon and robotics competition open for all engineering disciplines.', dateGroup: 'Sep 12, Saturday' },
    { title: 'Hostel Night Out & Gatepass Clearance Guidelines Update', snippet: 'Important updates regarding online gatepass approvals, local guardian verification, and curfew timings.', dateGroup: 'Sep 10, Thursday' },
    { title: 'Central Library Book Return & Digital Repository Access Renewal', snippet: 'Clearance procedure for borrowed central library books and digital repository access renewal.', dateGroup: 'Sep 08, Tuesday' },
    { title: 'Fee Payment Deadline Notice for Odd Semester 2026-2027', snippet: 'Final notification for pending semester fee installment submissions without late fee penalty.', dateGroup: 'Sep 05, Saturday' },
    { title: 'Special Workshop on Cloud Computing & AWS Architecture', snippet: '2-day hands-on AWS Cloud Practitioner training organized by the Department of Computer Science.', dateGroup: 'Sep 02, Wednesday' },
    { title: 'Student Experience & Campus Facilities Survey 2026-27', snippet: 'Mandatory online survey regarding academic delivery, lab equipment, hostel food, and transport.', dateGroup: 'Aug 30, Sunday' },
    { title: 'Blood Donation & Social Welfare Drive by NSS Student Club', snippet: 'Annual blood donation camp in collaboration with Red Cross Society at Student Activity Center.', dateGroup: 'Aug 28, Friday' },
    { title: 'Teachers Day Celebration & Cultural Evening Performance', snippet: 'Invitation for student performances, faculty honors, and evening cultural gala at Main Auditorium.', dateGroup: 'Aug 25, Tuesday' },
    { title: 'Anti-Ragging Squad Committee Guidelines & Emergency Helpline', snippet: 'Zero-tolerance policy statement, squad contact details, and emergency grievance portal.', dateGroup: 'Aug 20, Thursday' },
    { title: 'Registration for Value Added Certificate Courses (Fall 2026)', snippet: 'Enrollment open for Full Stack Web Development, Data Analytics, and AI prompt engineering courses.', dateGroup: 'Aug 18, Tuesday' },
    { title: 'Internal Assessment Marks & Attendance Verification Notice', snippet: 'Students must verify MST-1 evaluation marks and attendance percentage before August 25th.', dateGroup: 'Aug 15, Saturday' },
    { title: 'Campus Wi-Fi Infrastructure Upgrade & Password Reset Guidelines', snippet: 'High-speed 5G Wi-Fi access configuration guidelines for hostel residential blocks and academic wings.', dateGroup: 'Aug 12, Wednesday' },
    { title: 'Guest Lecture on Next Generation Microservices Architecture', snippet: 'Keynote lecture by Industry Principal Architect from Amazon Web Services India.', dateGroup: 'Aug 10, Monday' },
    { title: 'Coding Competition "CodeQuest 2026" Round 1 Results Declared', snippet: 'Shortlisted candidates for final round of algorithmic programming challenge.', dateGroup: 'Aug 08, Saturday' },
    { title: 'Hostel Mess Menu Revision & Feedback Meeting Summary', snippet: 'Updated daily breakfast, lunch, and dinner meal schedule based on student committee votes.', dateGroup: 'Aug 05, Wednesday' },
    { title: 'Cyber Security Awareness & Safe Digital Banking Workshop', snippet: 'Interactive session on fraud prevention, phishing protection, and secure online transactions.', dateGroup: 'Aug 02, Sunday' },
    { title: 'Industrial Visit to Infosys IT Park Chandigarh Announcement', snippet: 'Educational field trip registration for 3rd Year BE Computer Science students.', dateGroup: 'Jul 30, Thursday' },
    { title: 'Sports Club Selection Trials for University Basketball Team', snippet: 'Open selection trials for men and women basketball team representation in inter-university games.', dateGroup: 'Jul 28, Tuesday' },
    { title: 'Academic Mentor Allocation List for Odd Semester 2026', snippet: 'Faculty mentor assignments for academic guidance, career counseling, and project advice.', dateGroup: 'Jul 25, Saturday' },
    { title: 'E-Mobility & Electric Vehicle Design Project Challenge', snippet: 'Inter-departmental competition for developing sustainable EV battery management prototypes.', dateGroup: 'Jul 22, Wednesday' },
    { title: 'National Seminar on Quantum Computing Frontiers', snippet: 'Invited lectures by renowned scientists from ISRO and IISc Bangalore.', dateGroup: 'Jul 20, Monday' },
    { title: 'Scholarship Scheme Disbursement Status for Merit Holders', snippet: 'Notification regarding tuition fee waiver credits for top 5% rank holders in previous semester.', dateGroup: 'Jul 18, Saturday' },
    { title: 'Orientation Program for Incoming Batch 2026', snippet: 'Detailed schedule for freshman induction week and department orientation activities.', dateGroup: 'Jul 15, Wednesday' },
    { title: 'Alumni Mentorship Network Launch & Registration Portal', snippet: 'Connect with global alumni working in Google, Microsoft, Meta, and top startups.', dateGroup: 'Jul 12, Sunday' },
    { title: 'Environmental Sustainability Drive & Tree Plantation Campaign', snippet: 'Green campus initiative organized by Eco Club with free sapling distribution.', dateGroup: 'Jul 10, Friday' },
    { title: 'Standard Operating Procedures for Laboratory Equipment Handling', snippet: 'Safety guidelines for computer architecture, VLSI, and IoT hardware labs.', dateGroup: 'Jul 08, Wednesday' },
    { title: 'NPTEL Online Course Credit Transfer Guidelines 2026', snippet: 'List of pre-approved Swayam/NPTEL MOOC courses eligible for credit transfer.', dateGroup: 'Jul 05, Sunday' },
    { title: 'Library Operating Hours Extension During Examination Period', snippet: 'Central Library will remain open 24x7 with night reading lounge facilities.', dateGroup: 'Jul 02, Thursday' },
    { title: 'Medical Health Check-up Camp in Association with University Hospital', snippet: 'Free general health check-up, eye testing, and dental screening camp.', dateGroup: 'Jun 30, Tuesday' },
    { title: 'Entrepreneurship & Startup Incubation Grant Scheme 2026', snippet: 'Seed funding assistance up to Rs 5 Lakhs for student-led startup ideas.', dateGroup: 'Jun 28, Sunday' },
    { title: 'Guidelines for Submitting Summer Internship Completion Certificates', snippet: 'Format and submission portal link for 4-week summer industry training reports.', dateGroup: 'Jun 25, Thursday' },
    { title: 'University Convocation Ceremony Administrative Clearance Notice', snippet: 'Degree certificate dispatch and No-Dues clearance for graduating batches.', dateGroup: 'Jun 22, Monday' },
    { title: 'Robotics Workshop: Autonomous Rover Design & ROS Simulation', snippet: 'Hands-on training session on Robot Operating System and LIDAR sensor mapping.', dateGroup: 'Jun 20, Saturday' },
    { title: 'Cultural Club Registrations Open for Music, Dance & Dramatics', snippet: 'Sign up for university cultural clubs and auditions for upcoming fest team.', dateGroup: 'Jun 18, Thursday' },
    { title: 'Campus Transport Bus Routes & Timing Schedule Adjustment', snippet: 'Revised bus pickup points for Tri-city (Chandigarh, Mohali, Panchkula) routes.', dateGroup: 'Jun 15, Monday' },
    { title: 'Ethics in Artificial Intelligence & Machine Learning Webinar', snippet: 'Guest talk on responsible AI development and algorithmic bias mitigation.', dateGroup: 'Jun 12, Friday' },
    { title: 'Annual General Body Meeting of Student Government Council', snippet: 'Presentation of annual budget allocations and student welfare initiatives.', dateGroup: 'Jun 10, Wednesday' },
    { title: 'Disaster Management & Fire Safety Drill Schedule', snippet: 'Mandatory evacuation and safety drill conducted across all academic blocks.', dateGroup: 'Jun 08, Monday' },
    { title: 'Publication Incentive Award for Student Research Papers', snippet: 'Financial rewards for SCOPUS and Web of Science indexed journal publications.', dateGroup: 'Jun 05, Friday' },
    { title: 'Welcome Back to Campus: Opening Guidelines for Odd Semester 2026', snippet: 'Important instructions regarding hostel reporting, class commencement, and portal login.', dateGroup: 'Jun 01, Monday' }
  ];

  const filteredNotices = notices.filter(item => {
    if (subTab === 'All') return true;
    if (subTab === 'Circulars') return item.type === 'Circular';
    if (subTab === 'Resources') return item.type === 'Resource';
    if (subTab === 'Planners') return item.type === 'Planner';
    return true;
  });

  const unreadCircularCount = allCircularsList.filter(
    (c) => !readNoticeIds.includes(c.id || c.title)
  ).length;

  // Render BOOKICONA1.png icon matching exact screenshot
  const renderFolderIcon = () => (
    <img
      src="/BOOKICONA1.png"
      alt="Circular Icon"
      style={{ width: '34px', height: '34px', objectFit: 'contain' }}
    />
  );

  // Render Blue Folder with Node Chart (Gatepass & Duty Leave)
  const renderBlueFolderNodes = () => (
    <svg className="icon-svg-box" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="54" height="54" rx="14" fill="#0284C7" />
      <path d="M15 17C15 15.34 16.34 14 18 14H25L28 17H39C40.66 17 42 18.34 42 20V37C42 38.66 40.66 40 39 40H18C16.34 40 15 38.66 15 37V17Z" fill="#0284C7" />
      <circle cx="27" cy="25" r="3" fill="#FFFFFF" />
      <circle cx="21" cy="33" r="3" fill="#EF4444" />
      <circle cx="33" cy="33" r="3" fill="#EF4444" />
      <path d="M27 28V30M27 30H21M27 30H33" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Render Blue Folder with Node Chart + Red Arrow Cursor (View Details Gatepass)
  const renderBlueFolderCursor = () => (
    <svg className="icon-svg-box" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="54" height="54" rx="14" fill="#0284C7" />
      <path d="M15 17C15 15.34 16.34 14 18 14H25L28 17H39C40.66 17 42 18.34 42 20V37C42 38.66 40.66 40 39 40H18C16.34 40 15 38.66 15 37V17Z" fill="#0284C7" />
      <circle cx="27" cy="25" r="3" fill="#FFFFFF" />
      <circle cx="21" cy="33" r="3" fill="#EF4444" />
      <circle cx="33" cy="33" r="3" fill="#EF4444" />
      <path d="M27 28V30M27 30H21M27 30H33" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M33 24L44 32L38 34L42 42L38 44L34 36L30 40L33 24Z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );

  // Render Yellow Circular Laptop Chart Icon (Fees for semester)
  const renderFeeLaptopIcon = () => (
    <svg className="icon-svg-box" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27" r="23" fill="#FBBF24" />
      <rect x="14" y="15" width="26" height="17" rx="3" fill="#334155" />
      <rect x="17" y="18" width="20" height="11" rx="1" fill="#FFFFFF" />
      <path d="M19 26L23 22L27 24L34 19" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 33C11 32.45 11.45 32 12 32H42C42.55 32 43 32.45 43 33V35C43 36.1 42.1 37 41 37H13C11.9 37 11 36.1 11 35V33Z" fill="#64748B" />
    </svg>
  );

  // Render Blue Book Icon (No Dues Verification)
  const renderNoDuesBookIcon = () => (
    <svg className="icon-svg-box" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="54" height="54" rx="14" fill="#FFFFFF" />
      <path d="M14 18C14 15.79 15.79 14 18 14H36C38.21 14 40 15.79 40 18V36C40 38.21 38.21 40 36 40H18C15.79 40 14 38.21 14 36V18Z" fill="#3B82F6" />
      <path d="M18 18H36V36H18V18Z" fill="#FFFFFF" />
      <circle cx="22" cy="22" r="2.5" fill="#EF4444" />
      <rect x="27" y="20" width="6" height="4" fill="#F59E0B" />
      <rect x="22" y="28" width="11" height="2" fill="#3B82F6" />
      <rect x="22" y="32" width="8" height="2" fill="#3B82F6" />
    </svg>
  );

  // Render Greetings Icon
  const renderGreetingsIcon = () => (
    <img
      src="/GREETINGS.png"
      alt="Greetings"
      style={{ width: '56px', height: '56px', objectFit: 'contain' }}
    />
  );

  return (
    <div className="app-viewport-wrapper">
      {/* Top Frame Bar Controls */}
      <div className="top-bar-controls">
        <img src="/chalkpad_logo.png" alt="Chalkpad" style={{ height: '22px', borderRadius: '4px' }} />
        <span>Chalkpad Pro</span>
        <button
          className={`control-btn ${!isFullScreen ? 'active' : ''}`}
          onClick={() => setIsFullScreen(false)}
        >
          Phone Frame
        </button>
        <button
          className={`control-btn ${isFullScreen ? 'active' : ''}`}
          onClick={() => setIsFullScreen(true)}
        >
          Full View
        </button>
      </div>

      {/* Main Mobile App Phone Container */}
      <div className={`phone-container ${isFullScreen ? 'full-screen' : ''}`}>

        {/* Top Phone Status Bar */}
        <div className={`phone-status-bar ${activeTab === 'menu' || activeTab === 'profile' ? 'blue-header-status' : ''}`}>
          <span className="status-time">{currentTime}</span>
          <div className="status-icons">
            <span>📶</span>
            <span>📶</span>
            <span>🔋 33%</span>
          </div>
        </div>

        {/* APP BODY CONTAINER */}
        <div className="app-content" ref={contentRef}>

          {!isLoggedIn ? (
            loginStep === 'login' ? (
              <div style={{ background: '#ffffff', minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '24px 20px', fontFamily: 'Roboto, sans-serif' }}>
                {/* Top left back arrow in black circle */}
                <div style={{ marginBottom: '32px' }}>
                  <button
                    onClick={() => alert('Back to main portal')}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={24} color="#ffffff" />
                  </button>
                </div>

                {/* Center Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <img
                    src="/CHALKPADLOGO.png"
                    alt="Chalkpad Logo"
                    style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                  />
                </div>

                {/* Header Text */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
                    Login to your account
                  </h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    Please enter your credentials to access your account.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Username / Roll Number"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 4px',
                        border: 'none',
                        borderBottom: '1px solid #cbd5e1',
                        fontSize: '15px',
                        outline: 'none',
                        background: 'transparent',
                        color: '#0f172a'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 4px',
                        border: 'none',
                        borderBottom: '1px solid #cbd5e1',
                        fontSize: '15px',
                        outline: 'none',
                        background: 'transparent',
                        color: '#0f172a'
                      }}
                      required
                    />
                  </div>

                  {loginError && (
                    <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#000000',
                      color: '#ffffff',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '12px'
                    }}
                  >
                    Submit
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginTop: '6px' }}>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact ERP admin for password assistance.'); }} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '600' }}>
                      Forgot your password?
                    </a>
                    <a href="#back" onClick={(e) => { e.preventDefault(); alert('Returning to Institute Portal'); }} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '600' }}>
                      Back To Institute Login
                    </a>
                  </div>
                </form>

                <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '32px', fontSize: '11px', color: '#94a3b8' }}>
                  Powered by Chalkpad Technologies
                </div>
              </div>
            ) : (
              /* ONBOARDING FORM STEP 2 */
              <div style={{ background: '#ffffff', minHeight: '100%', padding: '24px 20px 80px 20px', fontFamily: 'Roboto, sans-serif' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', textAlign: 'center' }}>
                  Student Information Details
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
                  Please enter your details to complete your profile.
                </p>

                <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Photo Upload */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Profile Photo
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                      <img
                        src={editFormPhoto || studentPhoto}
                        alt="Profile Preview"
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
                      />
                      <div style={{ flex: 1 }}>
                        <label
                          htmlFor="onboarding-photo-input"
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Upload size={16} />
                          Upload Photo
                        </label>
                        <input
                          id="onboarding-photo-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditFormPhoto(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={editFormName}
                      onChange={(e) => setEditFormName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 600 }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Roll Number / UID
                    </label>
                    <input
                      type="text"
                      value={editFormRoll}
                      onChange={(e) => setEditFormRoll(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Semester / Batch Tag
                    </label>
                    <input
                      type="text"
                      value={editFormSem}
                      onChange={(e) => setEditFormSem(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={editFormFather}
                      onChange={(e) => setEditFormFather(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={editFormMother}
                      onChange={(e) => setEditFormMother(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Date of Birth (D.O.B.)
                    </label>
                    <input
                      type="text"
                      value={editFormDob}
                      onChange={(e) => setEditFormDob(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={editFormMobile}
                      onChange={(e) => setEditFormMobile(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormEmail}
                      onChange={(e) => setEditFormEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={editFormBlood}
                      onChange={(e) => setEditFormBlood(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Address & Pincode
                    </label>
                    <input
                      type="text"
                      value={editFormAddress}
                      onChange={(e) => setEditFormAddress(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: '#ffffff',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '12px'
                    }}
                  >
                    Save Details & Enter App
                  </button>
                </form>
              </div>
            )
          ) : (
            /* ==================================================== */
            /* VIEW: PERSONAL INFO PAGE (Sub-Page from Profile/Header) */
            /* ==================================================== */
            currentView === 'personal_info' ? (
              <div>
                <div className="page-subnav-header">
                  <button className="back-btn" onClick={() => setCurrentView('main')}>
                    <ChevronLeft size={24} />
                  </button>
                  <span className="page-title">Personal Info</span>
                </div>

                <div
                  className="personal-info-body"
                  onDoubleClick={openEditModal}
                  style={{ cursor: 'pointer' }}
                  title="Double click anywhere to edit details"
                >
                  <div className="info-section-title">Student's Details</div>

                  <div className="info-photo-center" onDoubleClick={openEditModal} style={{ cursor: 'pointer' }}>
                    <div className="info-photo-box">
                      <img src={studentPhoto} alt={studentName} />
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{studentName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Roll. No</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{rollNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Roll No.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{rollNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Gender</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">Male</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">D.O.B.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{dobInfo}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Category</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">General</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mobile No.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{mobileNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{emailInfo}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date of Admission</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">29-05-2024</span>
                  </div>

                  <div className="info-section-title">Student's Custom Field(s)</div>

                  <div className="info-row">
                    <span className="info-label">Blood Group</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{bloodGroup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Batch Duration For ID</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">2024-2028</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">College Name for ID</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">Chitkara University Institute of Engineering & Technology</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Degree Name for ID</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">BE - Computer Science & Engineering</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Year</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">2025</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Program</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">BE Computer Science & Engineering</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Batch</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">2024</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Name of the Institute</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">Chitkara University Institute of Engineering & Technology</span>
                  </div>

                  <div className="info-section-title">Permanent Address</div>

                  <div className="info-row">
                    <span className="info-label">Address</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{addressInfo}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">Rajpura</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Pin Code</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">140401</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">State</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">Punjab</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Country</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">India</span>
                  </div>

                  <div className="info-section-title">Father's Details</div>

                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{fatherName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mobile No.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">9780647351</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">amitswatiom@gmail.com</span>
                  </div>

                  <div className="info-section-title">Mother's Details</div>

                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">{motherName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mobile No.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">7508960179</span>
                  </div>

                  <div className="info-section-title">Guardian's Details</div>

                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">AMIT AGGARWAL</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mobile No.</span>
                    <span className="info-colon">:</span>
                    <span className="info-value">9780647351</span>
                  </div>
                </div>
              </div>
            ) : subView ? (
              <div>
                {subView === 'staff_messages' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Staff Messages</h2>
                    </div>

                    <div style={{ padding: '16px', background: '#f8fafc', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Search Name or Subject..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#ffffff', outline: 'none' }}
                      />
                      <button style={{ width: '44px', height: '42px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Search size={20} color="#1e293b" />
                      </button>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#38b2ac', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MessageSquare size={20} color="#ffffff" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e3a8a' }}>RAJAT KUMAR</div>
                        <div style={{ fontSize: '13.5px', color: '#64748b', marginTop: '2px' }}>Explore 20+ European...</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', alignSelf: 'flex-start' }}>3 Months Ago</div>
                    </div>
                  </div>
                )}

                {subView === 'messages_empty' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Messages</h2>
                    </div>

                    <div style={{ padding: '16px', background: '#f8fafc', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Search Name or Subject..."
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#ffffff', outline: 'none' }}
                      />
                      <button style={{ width: '44px', height: '42px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Search size={20} color="#1e293b" />
                      </button>
                    </div>

                    <div style={{ padding: '80px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500', color: '#2563eb' }}>No more Message(s)</div>
                    </div>
                  </div>
                )}

                {subView === 'circulars_list' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Circulars ({allCircularsList.length})</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      {allCircularsList.map((item, idx) => (
                        <React.Fragment key={idx}>
                          {(idx === 0 || allCircularsList[idx - 1].dateGroup !== item.dateGroup) && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '20px 0 12px 0' }}>
                              <span style={{ height: '1px', flex: 1, borderTop: '1px dashed #cbd5e1' }}></span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                                <Calendar size={16} color="#3b82f6" />
                                <span>{item.dateGroup}</span>
                              </div>
                              <span style={{ height: '1px', flex: 1, borderTop: '1px dashed #cbd5e1' }}></span>
                            </div>
                          )}

                          <div
                            onClick={() => openNoticeDetail(item, 'circulars_list')}
                            style={{ cursor: 'pointer', background: '#ffffff', border: '1.5px solid #9ca3af', borderRadius: '12px', padding: '16px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
                          >
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', lineHeight: 1.3 }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '13.5px', color: '#4b5563', marginTop: '8px', lineHeight: 1.4 }}>
                              {item.snippet}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {subView === 'circular_detail' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button
                        onClick={() => setSubView(detailReturnView)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}
                      >
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Circular</h2>
                    </div>

                    <div style={{ padding: '24px 16px 80px 16px' }}>
                      <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', lineHeight: 1.4, margin: 0 }}>
                        {selectedNotice?.title || 'Notice Regarding NALR ST-1, Batch-2024, Sem-5, CSE 3rd Year, Cluster(Gamma/i Gamm)'}
                      </h1>
                      <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, marginTop: '16px', marginBottom: '32px' }}>
                        {selectedNotice?.snippet || selectedNotice?.content || 'Notice Regarding NALR ST-1, Batch-2024, Sem-5, CSE 3rd Year, Cluster(Gamma/i Gamma)'}
                      </div>

                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
                        Attachment(s)
                      </div>

                      <div
                        onClick={() => alert(`Downloading attachment: ${selectedNotice?.attachmentName || 'Nalr_St-1.pdf'}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
                      >
                        <Paperclip size={18} color="#2563eb" />
                        <span>{selectedNotice?.attachmentName || 'Nalr_St-1.pdf'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'session_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Session</h2>
                    </div>

                    <div>
                      {[
                        'Jul-Dec 2022',
                        'JanJun2023',
                        'Jul-Dec2023',
                        'JanJun2024',
                        'Jul-Dec2024',
                        'JanJun2025',
                        'Jul-Dec2025',
                        'JanJun2026',
                        'JulDec2026'
                      ].map(session => (
                        <div
                          key={session}
                          onClick={() => setSelectedSession(session)}
                          style={{
                            padding: '18px 20px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#334155'
                          }}
                        >
                          <span>{session}</span>
                          {selectedSession === session && (
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subView === 'privacy_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', position: 'relative', paddingBottom: '60px' }}>
                    <div style={{ padding: '24px 20px' }}>
                      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 50 C20 25 35 15 50 15 C65 15 80 25 80 50 Z" fill="#a4c639" />
                        <circle cx="35" cy="35" r="4" fill="#ffffff" />
                        <circle cx="65" cy="35" r="4" fill="#ffffff" />
                        <line x1="30" y1="18" x2="20" y2="6" stroke="#a4c639" strokeWidth="4" strokeLinecap="round" />
                        <line x1="70" y1="18" x2="80" y2="6" stroke="#a4c639" strokeWidth="4" strokeLinecap="round" />
                      </svg>

                      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000', margin: '14px 0 12px 0' }}>
                        Web page not available
                      </h1>

                      <p style={{ fontSize: '15px', color: '#222222', margin: '0 0 2px 0', lineHeight: 1.4 }}>
                        The web page at
                      </p>

                      <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#000000', margin: 0, wordBreak: 'break-all' }}>
                        file:///android_asset/www/PRIVACY_POLICY
                      </p>

                      <p style={{ fontSize: '15px', color: '#222222', margin: '2px 0 18px 0' }}>
                        could not be loaded because:
                      </p>

                      <p style={{ fontSize: '15px', color: '#000000', margin: 0 }}>
                        net::ERR_FILE_NOT_FOUND
                      </p>
                    </div>

                    <div
                      style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '52px',
                        background: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '20px',
                        cursor: 'pointer',
                        zIndex: 100
                      }}
                      onClick={() => setSubView(null)}
                    >
                      <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '500' }}>Close</span>
                    </div>
                  </div>
                )}

                {subView === 'change_password_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Change Password</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      {/* Password Policy Card */}
                      <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                          <span>🔐</span>
                          <span>Password Policy</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '14.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '900', color: '#475569' }}>✓</span>
                            <span>At least <strong style={{ color: '#1e40af' }}>one uppercase letter</strong></span>
                          </div>
                          <div style={{ fontSize: '14.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '900', color: '#475569' }}>✓</span>
                            <span>At least <strong style={{ color: '#1e40af' }}>one lowercase letter</strong></span>
                          </div>
                          <div style={{ fontSize: '14.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '900', color: '#475569' }}>✓</span>
                            <span>At least <strong style={{ color: '#1e40af' }}>one number</strong></span>
                          </div>
                          <div style={{ fontSize: '14.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '900', color: '#475569' }}>✓</span>
                            <span>At least <strong style={{ color: '#1e40af' }}>one special character</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Password Inputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                          type="password"
                          placeholder="Old Password"
                          value={oldPasswordInput}
                          onChange={(e) => setOldPasswordInput(e.target.value)}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                        />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                        />
                      </div>

                      {passwordChangeError && (
                        <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: '600', marginTop: '12px' }}>
                          {passwordChangeError}
                        </div>
                      )}

                      {/* Red Change Button */}
                      <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button
                          onClick={handleChangePassword}
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 48px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'no_fee_due' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', padding: '16px 20px', cursor: 'pointer' }} onClick={() => setSubView(null)}>
                    <div style={{ fontSize: '18px', color: '#000000', fontFamily: 'serif, Georgia, Times, sans-serif' }}>
                      No Fee Due...
                    </div>
                  </div>
                )}

                {subView === 'subjects_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Subjects</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '16px' }}>
                        Subject(s) Details (5 SEM)
                      </div>

                      {[
                        { num: 1, name: 'Numerical Aptitude & Logical Reasoning - I (NALR-I)', spec: 'Full Stack Development', code: '25UNI0110', type: 'Theory', group: '24CSE-G08', credits: '---' },
                        { num: 2, name: 'System Design', spec: 'Full Stack Development', code: '24CSE0318', type: 'Theory', group: '24CSE-G08', credits: '---' },
                        { num: 3, name: 'Algorithm Design & Implementation', spec: 'Full Stack Development', code: '24CSE0317', type: 'Theory', group: '24CSE-G08', credits: '---' },
                        { num: 4, name: 'Programming Abstractions using Java', spec: 'Full Stack Development', code: '24CSE0314', type: 'Theory', group: '24CSE-G08', credits: '4' },
                        { num: 5, name: 'Back End Engineering-II', spec: 'Full Stack Development', code: '24CSE0315', type: 'Practical', group: 'P24CSE-G08', credits: '---' },
                        { num: 6, name: 'Artificial Intelligence and Machine Learning', spec: 'Full Stack Development', code: '24CSE0316', type: 'Theory', group: '24CSE-G08', credits: '---' }
                      ].map(sub => (
                        <div key={sub.num} style={{ display: 'flex', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155', minWidth: '18px' }}>{sub.num}.</span>
                          <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div><strong style={{ color: '#1e293b' }}>Subject Name:</strong> {sub.name}</div>
                            <div><strong style={{ color: '#1e293b' }}>Specialization:</strong> {sub.spec}</div>
                            <div><strong style={{ color: '#1e293b' }}>Subject Code:</strong> {sub.code}</div>
                            <div><strong style={{ color: '#1e293b' }}>Subject Type:</strong> {sub.type}</div>
                            <div><strong style={{ color: '#1e293b' }}>Group:</strong> {sub.group}</div>
                            <div><strong style={{ color: '#1e293b' }}>Credits:</strong> {sub.credits}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subView === 'timetable_view' && (
                  <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Timetable</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>2024-BE-CSE-5 SEM</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>As on <strong>06-10-2026 (Tuesday)</strong></div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Monday */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Monday ➤</span>
                        </div>

                        {/* Tuesday */}
                        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                          <div style={{ padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '700', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Tuesday (Today) ▼</span>
                          </div>

                          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Period 1 */}
                            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Period 1 (TG410)</span>
                                <span style={{ background: '#16a34a', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>Completed</span>
                              </div>
                              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>09:00 AM - 10:00 AM | <strong>24UNI0133</strong></div>
                            </div>

                            {/* Period 2 */}
                            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Period 2 (TG410)</span>
                                <span style={{ background: '#16a34a', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>Completed</span>
                              </div>
                              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>10:00 AM - 11:00 AM | <strong>24UNI0133</strong></div>
                            </div>

                            {/* Period 3 Live */}
                            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#991b1b' }}>Period 3 (TG410)</span>
                                <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>Live</span>
                              </div>
                              <div style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '4px', fontWeight: '600' }}>11:00 AM - 12:00 PM | 24CSE0317</div>
                              <div style={{ fontSize: '12.5px', color: '#7f1d1d', marginTop: '8px', lineHeight: 1.5, borderTop: '1px dashed #fca5a5', paddingTop: '8px' }}>
                                <div><strong>Subject:</strong> 24CSE0317</div>
                                <div><strong>Location:</strong> TG410</div>
                                <div><strong>Group:</strong> 24CSE-G08</div>
                                <div><strong>Teacher:</strong> MEENAKSHI</div>
                              </div>
                            </div>

                            {/* Period 4-13 */}
                            {[
                              { num: 4, code: '24CSE0317', time: '12:00 PM - 01:00 PM' },
                              { num: 5, code: '', time: '01:00 PM - 02:00 PM' },
                              { num: 6, code: '24CSE0316', time: '02:00 PM - 03:00 PM' },
                              { num: 7, code: '24CSE0316', time: '03:00 PM - 04:00 PM' },
                              { num: 8, code: '', time: '04:00 PM - 05:00 PM' },
                              { num: 9, code: '', time: '05:00 PM - 06:00 PM' },
                              { num: 10, code: '', time: '06:00 PM - 07:00 PM' },
                              { num: 11, code: '', time: '07:00 PM - 08:00 PM' },
                              { num: 12, code: '', time: '08:00 PM - 09:00 PM' },
                              { num: 13, code: '', time: '09:00 PM - 10:00 PM' }
                            ].map(p => (
                              <div key={p.num} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Period {p.num} (TG410)</span>
                                  <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>Upcoming</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{p.time} {p.code && `| ${p.code}`}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Wednesday */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                          <span>Wednesday ➤</span>
                        </div>
                        {/* Thursday */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                          <span>Thursday ➤</span>
                        </div>
                        {/* Friday */}
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                          <span>Friday ➤</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'attendance_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Attendance Subjectwise</h2>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {[
                        { sub: 'Programming Abstractions using Java', code: '24CSE0314', teacher: 'DEEPAK AHLAWAT, Suhasini', from: '25 Jun 2026', to: '14 Sep 2026', del: 42, att: 32, abs: 10, pct: '76.19%' },
                        { sub: 'Back End Engineering-II', code: '24CSE0315', teacher: 'Suhasini', from: '21 Sep 2026', to: '05 Oct 2026', del: 6, att: 6, abs: 0, pct: '100%' },
                        { sub: 'Artificial Intelligence and Machine Learning', code: '24CSE0316', teacher: 'PRIYANKA GUPTA', from: '26 Jun 2026', to: '06 Oct 2026', del: 58, att: 48, abs: 10, pct: '82.76%' },
                        { sub: 'Algorithm Design & Implementation', code: '24CSE0317', teacher: 'MEENAKSHI', from: '02 Jul 2026', to: '05 Oct 2026', del: 108, att: 92, abs: 16, pct: '85.19%' },
                        { sub: 'System Design', code: '24CSE0318', teacher: 'ANMOL RATTAN SINGH, Gurtej Kaur', from: '24 Jun 2026', to: '16 Sep 2026', del: 36, att: 26, abs: 10, pct: '72.22%' },
                        { sub: 'Business Professional Communication', code: '24UNI0133', teacher: 'JASBIR KAUR', from: '30 Jun 2026', to: '22 Sep 2026', del: 44, att: 36, abs: 8, pct: '81.82%' },
                        { sub: 'Numerical Aptitude & Logical Reasoning - I (NALR-I)', code: '25UNI0110', teacher: 'Divjot Singh', from: '24 Jun 2026', to: '21 Sep 2026', del: 48, att: 32, abs: 16, pct: '66.67%' }
                      ].map(item => (
                        <div key={item.code} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                          {/* Title Row */}
                          <div style={{ padding: '12px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#ffffff' }}>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', flex: 1, paddingRight: '12px', lineHeight: 1.3 }}>
                              {item.sub}
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                              {item.code}
                            </span>
                          </div>

                          {/* Details Rows */}
                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>Teacher : </span>
                            <span style={{ color: '#64748b' }}>{item.teacher}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>From : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.from}</span>
                            <span style={{ fontWeight: '800', marginLeft: '12px' }}>TO : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.to}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Delivered : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.del}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Attended : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.att}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Absent : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.abs}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>DL : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>0</span>
                            <span style={{ fontWeight: '800', marginLeft: '8px' }}>ML : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>0</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Total Percentage : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>{item.pct}</span>
                          </div>

                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Total Approved DL : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>0</span>
                          </div>

                          <div style={{ padding: '10px 14px', fontSize: '14px', color: '#0f172a' }}>
                            <span style={{ fontWeight: '800' }}>Total Approved ML : </span>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>0</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subView === 'student_survey_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Student Experience Survey</h2>
                    </div>

                    <div style={{ padding: '24px 16px' }}>
                      <div style={{ fontSize: '16px', color: '#2563eb', fontWeight: '400', lineHeight: 1.5 }}>
                        No active student survey is available at this time.
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'no_dues_view' && (
                  <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>No Dues Verification</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                          Approval Workflow
                        </div>

                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
                          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Request Date</div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>14-07-2026 11:36:11</div>
                        </div>

                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Progress</div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>3 / 5 Completed</div>
                          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '60%', height: '100%', background: '#2563eb', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Step 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🏫</span> Academic Department
                              </div>
                            </div>
                            <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Pending</span>
                          </div>

                          {/* Step 2 */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>2</div>
                              <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>📚</span> Library
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginTop: '4px' }}>JASPREET SINGH(CET1001049)</div>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>14-07-2026</div>
                              </div>
                            </div>
                            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Approved</span>
                          </div>

                          {/* Step 3 */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>3</div>
                              <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>🏆</span> Sports Department
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginTop: '4px' }}>Manish Singh(CET1004493)</div>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>16-07-2026</div>
                              </div>
                            </div>
                            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Approved</span>
                          </div>

                          {/* Step 4 */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>4</div>
                              <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>💻</span> IT Department
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginTop: '4px' }}>Deepak Sahore(CET1000193)</div>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>15-07-2026</div>
                              </div>
                            </div>
                            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Approved</span>
                          </div>

                          {/* Step 5 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</div>
                              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🧾</span> Accounts Department
                              </div>
                            </div>
                            <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'greetings_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>My Greetings</h2>
                    </div>

                    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                        <img src="/GREETINGS1.jpg" alt="Greeting 1" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                        <img src="/GREETINGS2.jpg" alt="Greeting 2" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                        <img src="/GREETINGS3.jpg" alt="Greeting 3" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                        <img src="/GREETINGS4.jpg" alt="Greeting 4" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'fee_payment_history_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Fee Payment History</h2>
                    </div>

                    <div style={{ padding: '16px 20px 20px 20px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e2e8f0', cursor: 'pointer' }} onDoubleClick={openEditModal}>
                        <img src={studentPhoto} alt={studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                    <div>
                      {[
                        { num: 1, cycle: 'Jul-Dec 2024 SEM 1st', amount: 'Rs. 20000.00', receipt: '24-25/CDN/02896', date: '29-05-2024', bg: '#ffffff' },
                        { num: 2, cycle: 'Jul-Dec 2024 SEM 1st', amount: 'Rs. 100000.00', receipt: 'CU/PB/24-25/03021', date: '29-05-2024', bg: '#f8fafc' },
                        { num: 3, cycle: 'Jan-June 2025 SEM 2nd', amount: 'Rs. 20000.00', receipt: 'EXPLR/1013/4876', date: '19-12-2024', bg: '#ffffff' },
                        { num: 4, cycle: 'Jan-June 2025 SEM 2nd', amount: 'Rs. 100000.00', receipt: 'FR-43341-1912-506', date: '19-12-2024', bg: '#f8fafc' }
                      ].map(item => (
                        <div key={item.num} style={{ padding: '16px 20px', background: item.bg, borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{item.num}.</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Fee paid for cycle(s):</div>
                                  <div style={{ fontSize: '14px', color: '#334155', marginTop: '2px' }}>{item.cycle}</div>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{item.amount}</div>
                              </div>

                              <div style={{ fontSize: '14px', color: '#1e293b', marginTop: '6px' }}>
                                <strong>Receipt No.:</strong> {item.receipt}
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                                  <strong>Paid On:</strong> {item.date}
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}>
                                  Print Receipt
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subView === 'apply_gatepass_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Apply Gatepass</h2>
                    </div>

                    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Name</label>
                        <input
                          type="text"
                          value={studentName}
                          readOnly
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontSize: '14px', fontWeight: '700', color: '#475569', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Date</label>
                        <input
                          type="text"
                          value="06/10/2026"
                          readOnly
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontSize: '14px', fontWeight: '700', color: '#475569', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Time<span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            defaultValue="11:43"
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #0f172a', fontSize: '15px', color: '#0f172a', outline: 'none', background: '#ffffff' }}
                          />
                          <Clock size={20} color="#475569" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Reason/Remarks<span style={{ color: '#ef4444' }}>*</span></label>
                        <textarea
                          rows="4"
                          placeholder="Type your reason here..."
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #0f172a', fontSize: '14px', outline: 'none', background: '#ffffff', resize: 'vertical' }}
                        ></textarea>
                      </div>

                      <div style={{ background: '#e0f2fe', border: '1px dashed #0284c7', borderRadius: '6px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>+</div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Attach File(s)</span>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            triggerConfirm('apply_gp', 'Your Gatepass has been applied sucessfully', () => setSubView(null));
                          }}
                          style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '700', marginTop: '10px', cursor: 'pointer' }}
                        >
                          Apply Gate Pass
                        </button>
                        {confirmKey === 'apply_gp' && (
                          <div style={{ marginTop: '8px', color: '#16a34a', fontSize: '13.5px', fontWeight: '700', textAlign: 'center' }}>
                            {confirmMsg}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'apply_leave_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100%', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 12px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
                      <button
                        onClick={() => { setSubView(null); setLeaveTab('apply'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '8px', display: 'flex', alignItems: 'center' }}
                      >
                        <ChevronLeft size={24} color="#111827" />
                      </button>
                      <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0, flex: 1, textAlign: 'center', paddingRight: '32px' }}>
                        Apply Duty/Medical Leave
                      </h2>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
                      <button
                        onClick={() => setLeaveTab('apply')}
                        style={{
                          flex: 1,
                          padding: '13px 8px',
                          border: 'none',
                          background: 'none',
                          fontSize: '15px',
                          fontWeight: leaveTab === 'apply' ? 700 : 600,
                          color: leaveTab === 'apply' ? '#ef3e3e' : '#111827',
                          borderBottom: leaveTab === 'apply' ? '3px solid #ef3e3e' : '3px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        Apply Leave
                      </button>
                      <button
                        onClick={() => setLeaveTab('history')}
                        style={{
                          flex: 1,
                          padding: '13px 8px',
                          border: 'none',
                          background: 'none',
                          fontSize: '15px',
                          fontWeight: leaveTab === 'history' ? 700 : 600,
                          color: leaveTab === 'history' ? '#ef3e3e' : '#111827',
                          borderBottom: leaveTab === 'history' ? '3px solid #ef3e3e' : '3px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        Leave History
                      </button>
                    </div>

                    {leaveTab === 'apply' ? (
                      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Leave Type */}
                        <div>
                          <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                            Leave Type<span style={{ color: '#ef3e3e' }}>*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <select
                              value={leaveType}
                              onChange={(e) => setLeaveType(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '12px 36px 12px 12px',
                                borderRadius: '6px',
                                border: '1px solid #111827',
                                fontSize: '14px',
                                background: '#ffffff',
                                outline: 'none',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                color: '#111827'
                              }}
                            >
                              <option>Duty Leave</option>
                              <option>Medical Leave</option>
                            </select>
                            <ChevronDown size={18} color="#6b7280" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          </div>
                        </div>

                        {leaveType === 'Duty Leave' && (
                          <>
                            <div>
                              <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                                Category<span style={{ color: '#ef3e3e' }}>*</span>
                              </label>
                              <div style={{ position: 'relative' }}>
                                <select
                                  value={leaveCategory}
                                  onChange={(e) => setLeaveCategory(e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '12px 36px 12px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #111827',
                                    fontSize: '14px',
                                    background: '#ffffff',
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    color: '#111827'
                                  }}
                                >
                                  <option>3D printing workshop</option>
                                  <option>A Creative Innovation workshop</option>
                                  <option>ACM Chapter</option>
                                </select>
                                <ChevronDown size={18} color="#6b7280" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                              </div>
                            </div>

                            <div>
                              <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                                Event Name<span style={{ color: '#ef3e3e' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={leaveEventName}
                                onChange={(e) => setLeaveEventName(e.target.value)}
                                placeholder="Enter Event Name"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  borderRadius: '6px',
                                  border: '1px solid #111827',
                                  fontSize: '14px',
                                  outline: 'none',
                                  background: '#ffffff',
                                  color: '#111827'
                                }}
                              />
                            </div>
                          </>
                        )}

                        {/* Start / End Date */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                              Start Date<span style={{ color: '#ef3e3e' }}>*</span>
                            </label>
                            <input
                              type="date"
                              value={leaveStartDate}
                              onChange={(e) => setLeaveStartDate(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '12px 10px',
                                borderRadius: '6px',
                                border: '1px solid #111827',
                                fontSize: '13px',
                                outline: 'none',
                                background: '#ffffff',
                                color: leaveStartDate ? '#111827' : '#9ca3af'
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                              End Date<span style={{ color: '#ef3e3e' }}>*</span>
                            </label>
                            <input
                              type="date"
                              value={leaveEndDate}
                              onChange={(e) => setLeaveEndDate(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '12px 10px',
                                borderRadius: '6px',
                                border: '1px solid #111827',
                                fontSize: '13px',
                                outline: 'none',
                                background: '#ffffff',
                                color: leaveEndDate ? '#111827' : '#9ca3af'
                              }}
                            />
                          </div>
                        </div>

                        {leaveType === 'Duty Leave' && (
                          <div>
                            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                              Time Slot<span style={{ color: '#ef3e3e' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                              <select
                                value={leaveTimeSlot}
                                onChange={(e) => setLeaveTimeSlot(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 36px 12px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #111827',
                                  fontSize: '14px',
                                  background: '#ffffff',
                                  outline: 'none',
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  color: '#111827'
                                }}
                              >
                                <option>Full Day</option>
                                <option>First Half</option>
                                <option>Second Half</option>
                              </select>
                              <ChevronDown size={18} color="#6b7280" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                          </div>
                        )}

                        {leaveType === 'Medical Leave' && (
                          <div>
                            <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '6px' }}>
                              Attachment<span style={{ color: '#ef3e3e' }}>*</span>
                            </label>
                            <label
                              htmlFor="leave-attach-input"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                background: '#e8f4fc',
                                border: '1.5px dashed #111827',
                                borderRadius: '6px',
                                padding: '18px 14px',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, lineHeight: 1 }}>+</div>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                {leaveAttachmentName || 'Attach File(s)'}
                              </span>
                              <input
                                id="leave-attach-input"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setLeaveAttachmentName(file.name);
                                }}
                              />
                            </label>
                          </div>
                        )}

                        <div>
                          <button
                            onClick={() => {
                              if (!leaveStartDate || !leaveEndDate) {
                                alert('Please select Start Date and End Date.');
                                return;
                              }
                              if (leaveType === 'Duty Leave' && !leaveEventName.trim()) {
                                alert('Please enter Event Name.');
                                return;
                              }
                              if (leaveType === 'Medical Leave' && !leaveAttachmentName) {
                                alert('Please attach a medical document.');
                                return;
                              }
                              const entry = {
                                id: Date.now(),
                                type: leaveType,
                                category: leaveType === 'Duty Leave' ? leaveCategory : null,
                                eventName: leaveType === 'Duty Leave' ? leaveEventName : null,
                                startDate: leaveStartDate,
                                endDate: leaveEndDate,
                                timeSlot: leaveType === 'Duty Leave' ? leaveTimeSlot : null,
                                attachment: leaveType === 'Medical Leave' ? leaveAttachmentName : null,
                                status: 'Submitted'
                              };
                              setLeaveHistory((prev) => [entry, ...prev]);
                              triggerConfirm('apply_leave', 'Your Duty / Medical Leave has been applied sucessfully', () => {
                                setLeaveEventName('');
                                setLeaveStartDate('');
                                setLeaveEndDate('');
                                setLeaveAttachmentName('');
                                setLeaveTab('history');
                              });
                            }}
                            style={{
                              width: '100%',
                              padding: '14px',
                              background: '#ef3e3e',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '15px',
                              fontWeight: 700,
                              marginTop: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Apply Leave
                          </button>
                          {confirmKey === 'apply_leave' && (
                            <div style={{ marginTop: '8px', color: '#16a34a', fontSize: '13.5px', fontWeight: 700, textAlign: 'center' }}>
                              {confirmMsg}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '16px' }}>
                        {leaveHistory.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>
                            No leave applications yet.
                          </div>
                        ) : (
                          leaveHistory.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '14px',
                                marginBottom: '12px',
                                background: '#ffffff'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{item.type}</span>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef3e3e', background: '#fee2e2', padding: '3px 8px', borderRadius: '999px' }}>
                                  {item.status}
                                </span>
                              </div>
                              {item.eventName && (
                                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>{item.eventName}</div>
                              )}
                              {item.category && (
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{item.category}</div>
                              )}
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {item.startDate} → {item.endDate}
                                {item.timeSlot ? ` · ${item.timeSlot}` : ''}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {subView === 'view_details_gatepass_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>View Details Gatepass</h2>
                    </div>

                    {/* Top Two Tabs */}
                    <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#ffffff' }}>
                      <button style={{ flex: 1, padding: '14px', border: 'none', borderBottom: '3px solid #2563eb', background: 'none', fontSize: '15px', fontWeight: '700', color: '#2563eb', cursor: 'pointer' }}>
                        Outing Gatepass
                      </button>
                      <button style={{ flex: 1, padding: '14px', border: 'none', background: 'none', fontSize: '15px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}>
                        Leave Gatepass
                      </button>
                    </div>

                    <div style={{ padding: '80px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500', color: '#2563eb' }}>
                        No record found
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'gradecard_view' && (
                  <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <button onClick={() => setSubView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={24} color="#0f172a" />
                      </button>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Grade Card</h2>
                    </div>

                    <div style={{ padding: '16px' }}>
                      {/* Header Info */}
                      <div style={{ padding: '0px', textAlign: 'left', marginBottom: '20px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', color: '#333333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>Name: <b>{studentName}</b></div>
                          <div>Roll No.: <b>{rollNumber}</b></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>Father's Name: <b>{fatherName.toUpperCase()}</b></div>
                          <div>Mother's Name: <b>{motherName.toUpperCase()}</b></div>
                        </div>
                        <div>Class Name: <b>{semesterInfo}</b></div>
                      </div>

                      {/* Table matching user HTML styling */}
                      <table width="100%" cellSpacing="0" cellPadding="0" border="0" style={{ border: '1px solid #CCCCCC', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                          <tr>
                            <td align="center" width="6%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC' }}><strong>#</strong></td>
                            <td align="left" width="22%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC', paddingLeft: '4px' }}><strong>Subject Code</strong></td>
                            <td align="left" width="34%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC', paddingLeft: '4px' }}><strong>Subject Name</strong></td>
                            <td align="center" width="13%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC' }}><strong>Credits</strong></td>
                            <td align="center" width="10%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC' }}><strong>Grade</strong></td>
                            <td align="center" width="15%" style={{ background: 'linear-gradient(#fafafa,#e4e4e4)', fontWeight: 'bold', color: '#333', height: '26px', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', border: '1px solid #CCCCCC' }}><strong>Study Period</strong></td>
                          </tr>
                        </thead>
                        <tbody>
                          {/* SEM 1 */}
                          {[
                            { num: 1, code: '24APS1101', name: 'CALCULUS AND STATISTICAL ANALYSIS', cred: '4.00', grade: 'P', sem: '1 SEM', bg: '#f9f9f9' },
                            { num: 2, code: '24CSE0101', name: 'PROBLEM SOLVING USING PYTHON PROGRAMMING', cred: '5.00', grade: 'C', sem: '1 SEM', bg: '#ffffff' },
                            { num: 3, code: '24CSE0102', name: 'FRONT END ENGINEERING-I', cred: '5.00', grade: 'A+', sem: '1 SEM', bg: '#f9f9f9' },
                            { num: 4, code: '24CSE0103', name: 'DIGITAL ELECTRONICS AND COMPUTERS ARCHITECTURE', cred: '4.00', grade: 'B+', sem: '1 SEM', bg: '#ffffff' },
                            { num: 5, code: '24MOC0113', name: 'FINANCIAL ACCOUNTING - I', cred: '2.00', grade: 'A+', sem: '1 SEM', bg: '#f9f9f9' },
                            { num: 6, code: '24UNI0125', name: 'DISASTER MANAGEMENT', cred: '0.00', grade: 'O', sem: '1 SEM', bg: '#ffffff' }
                          ].map(row => (
                            <tr key={row.code + row.num}>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.num}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.code}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.name}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.cred}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.grade}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.sem}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} style={{ backgroundColor: '#f9f9f9', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }}></td>
                            <td colSpan={3} style={{ backgroundColor: '#f9f9f9', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', whiteSpace: 'nowrap' }} align="left">
                              <span style={{ marginRight: '16px' }}><b>SGPA: 6.45</b></span>
                              <span><b>CGPA: 6.45</b></span>
                            </td>
                          </tr>

                          {/* SEM 2 */}
                          {[
                            { num: 1, code: '24APS0102', name: 'MODERN AND COMPUTATIONAL PHYSICS', cred: '4.00', grade: 'B+', sem: '2 SEM', bg: '#f9f9f9' },
                            { num: 2, code: '24APS2101', name: 'DIFFERENTIAL EQUATIONS AND TRANSFORMATIONS', cred: '4.00', grade: 'A', sem: '2 SEM', bg: '#ffffff' },
                            { num: 3, code: '24CSE0105', name: 'OPERATING SYSTEM', cred: '3.00', grade: 'B+', sem: '2 SEM', bg: '#f9f9f9' },
                            { num: 4, code: '24CSE0106', name: 'SOURCE CODE MANAGEMENT', cred: '2.00', grade: 'O', sem: '2 SEM', bg: '#ffffff' },
                            { num: 5, code: '24CSE0107', name: 'FUNDAMENTALS OF C PROGRAMMING', cred: '4.00', grade: 'F', sem: '2 SEM', bg: '#f9f9f9' },
                            { num: 6, code: '24MOC0111', name: 'INDIAN KNOWLEDGE SYSTEM', cred: '2.00', grade: 'A+', sem: '2 SEM', bg: '#ffffff' },
                            { num: 7, code: '24MOC0124', name: 'OPEN ELECTIVE 2- FINANCIAL ACCOUNTING-II', cred: '2.00', grade: 'A+', sem: '2 SEM', bg: '#f9f9f9' },
                            { num: 8, code: '24MOC0131', name: 'ENVIRONMENTAL STUDIES', cred: '2.00', grade: 'A+', sem: '2 SEM', bg: '#ffffff' },
                            { num: 9, code: '25AI001', name: 'THE RUDIMENTS OF ARTIFICIAL INTELLIGENCE, CHATGPT, DEEPSEEK, GROK AND METAVERSE', cred: '1.00', grade: 'O', sem: '2 SEM', bg: '#f9f9f9' }
                          ].map(row => (
                            <tr key={row.code + row.num}>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.num}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.code}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.name}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.cred}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.grade}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.sem}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }}></td>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', whiteSpace: 'nowrap' }} align="left">
                              <span style={{ marginRight: '16px' }}><b>SGPA: 7.60</b></span>
                              <span><b>CGPA: 7.10</b></span>
                            </td>
                          </tr>

                          {/* SEM 3 */}
                          {[
                            { num: 1, code: '24CSE0208', name: 'Data Structures Using Object Oriented Programming - I', cred: '6.00', grade: 'B+', sem: '3 SEM', bg: '#f9f9f9' },
                            { num: 2, code: '24CSE0209', name: 'EMBEDED SYSTEMS AND INTERNET OF THINGS', cred: '4.00', grade: 'A', sem: '3 SEM', bg: '#ffffff' },
                            { num: 3, code: '24CSE0210', name: 'DATABASE MANAGEMENT SYSTEM', cred: '3.00', grade: 'B+', sem: '3 SEM', bg: '#f9f9f9' },
                            { num: 4, code: '24CSE0211', name: 'OBJECT ORIENTED SOFTWARE ENGINEERING', cred: '3.00', grade: 'O', sem: '3 SEM', bg: '#ffffff' },
                            { num: 5, code: '24CSE0212', name: 'HUMAN VALUES AND PROFESSIONAL EITHICS', cred: '2.00', grade: 'O', sem: '3 SEM', bg: '#f9f9f9' },
                            { num: 6, code: '24CSE0213', name: 'IP& CPR LAWS', cred: '2.00', grade: 'O', sem: '3 SEM', bg: '#ffffff' },
                            { num: 7, code: '24MOC0124', name: 'FRONT END ENGINEERING-II', cred: '4.00', grade: 'A+', sem: '3 SEM', bg: '#f9f9f9' }
                          ].map(row => (
                            <tr key={row.code + row.num}>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.num}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.code}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.name}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.cred}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.grade}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.sem}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }}></td>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', whiteSpace: 'nowrap' }} align="left">
                              <span style={{ marginRight: '16px' }}><b>SGPA: 7.52</b></span>
                              <span><b>CGPA: 7.18</b></span>
                            </td>
                          </tr>

                          {/* SEM 4 */}
                          {[
                            { num: 1, code: '24CSE0212', name: 'DISCRETE STRUCTURES', cred: '3.00', grade: 'O', sem: '4 SEM', bg: '#f9f9f9' },
                            { num: 2, code: '24CSE0213', name: 'DATA STRUCTURES USING OBJECT ORIENTED PROGRAMMING - II', cred: '5.00', grade: 'B', sem: '4 SEM', bg: '#ffffff' },
                            { num: 3, code: '24CSE0214', name: 'LINUX ADMINISTRATION', cred: '3.00', grade: 'B+', sem: '4 SEM', bg: '#f9f9f9' },
                            { num: 4, code: '24CSE0215', name: 'BACK END ENGINEERING - I', cred: '3.00', grade: 'A', sem: '4 SEM', bg: '#ffffff' },
                            { num: 5, code: '24CSE0225', name: 'COMPUTER NETWORKS', cred: '3.00', grade: 'A', sem: '4 SEM', bg: '#ffffff' },
                            { num: 6, code: '24CSE0216', name: 'AI: STACK AND MACHINE LEARNING', cred: '2.00', grade: 'O', sem: '4 SEM', bg: '#f9f9f9' },
                            { num: 7, code: '24CSE0217', name: 'INDUSTRY IMMERSION SERIES', cred: '2.00', grade: 'O', sem: '4 SEM', bg: '#ffffff' },
                            { num: 8, code: '24MOC0124', name: 'CYBER SECURITY FOR EVERYONE', cred: '2.00', grade: 'O', sem: '4 SEM', bg: '#f9f9f9' }
                          ].map(row => (
                            <tr key={row.code + row.num}>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.num}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.code}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="left">{row.name}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.cred}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.grade}</td>
                              <td style={{ backgroundColor: row.bg, padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }} align="center">{row.sem}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }}></td>
                            <td colSpan={3} style={{ backgroundColor: '#ffffff', padding: '5px', borderBottom: '1px solid #eeeeee', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', whiteSpace: 'nowrap' }} align="left">
                              <span style={{ marginRight: '16px' }}><b>SGPA: 7.83</b></span>
                              <span><b>CGPA: 7.10</b></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Note Box */}
                      <div style={{ padding: '20px', backgroundColor: 'aliceblue', marginTop: '15px', textAlign: 'left', fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px', color: '#333333' }}>
                        <b>Note:</b>
                        <ul style={{ padding: '15px', margin: '0px', lineHeight: '26px' }}>
                          <li>The University does not own for the error or omission, if any, in the statement. The marks in the record of the University are final.</li>
                          <li>In case of any discrepancy in Name, Father's name, Mother's name, Course Code, Course Name, Credit, SGPA & CGPA, kindly submit an application with relevant documents in the Examination Department duly forwarded by the Dean within 7 working days.</li>
                          <li>Student can apply for re-evaluation of theory external examination within 15 days of the date of declaration of result with prescribed fee.</li>
                          <li>Abbreviations: "F" means Fail, "I" means incomplete, "E1" means Internal Re-appear, "E2" means External Re-appear & "E3" means Internal & External Re-appear.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* MAIN TABS SWITCHER */
              <>
                {/* TAB 1: TIMELINE */}
                {activeTab === 'timeline' && (
                  <div>
                    {/* LONG PRESS OR DOUBLE CLICK OR EDIT BUTTON TO EDIT TIMELINE HEADER */}
                    <div
                      className="header-bar-white"
                      onMouseDown={handlePressStart}
                      onMouseUp={handlePressEnd}
                      onTouchStart={handlePressStart}
                      onTouchEnd={handlePressEnd}
                      onDoubleClick={openEditModal}
                      style={{ cursor: 'pointer', userSelect: 'none', position: 'relative' }}
                      title="Long press or double click to edit header"
                    >
                      <h1 className="header-title-text">{studentName}({semesterInfo})</h1>
                      <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '2px', fontWeight: 500 }}>

                      </span>
                    </div>

                    <div className="subnav-bar">
                      {['All', 'Circulars', 'Resources', 'Planners'].map(tab => (
                        <button
                          key={tab}
                          className={`subnav-item ${subTab === tab ? 'active' : ''}`}
                          onClick={() => setSubTab(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="feed-container">
                      {filteredNotices.map(item => {
                        const itemId = item.id || item.title;
                        const isUnread = item.isNew && !readNoticeIds.includes(itemId);
                        return (
                          <div
                            key={itemId}
                            className="feed-card"
                            onClick={() => openNoticeDetail(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="card-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {renderFolderIcon()}
                                <span className="badge-pill badge-type">{item.type}</span>
                              </div>
                              {isUnread && <span className="badge-pill badge-new">NEW</span>}
                            </div>

                            <div className="card-title" style={{ marginTop: '6px' }}>{item.title}</div>
                            <div className="card-desc">{item.snippet}</div>

                            <div className="card-footer-row">
                              <button className="view-details-btn">
                                View Details
                              </button>
                              <div className="date-badge">
                                <Calendar size={13} />
                                <span>{item.date}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: MESSAGES */}
                {activeTab === 'messages' && (
                  <div className="messages-screen">
                    <div className="messages-header-white">
                      Messages
                    </div>

                    <div
                      className="message-item-card"
                      onClick={() => setSubView('staff_messages')}
                    >
                      <div className="circle-icon-teal">
                        <Mail size={22} />
                      </div>
                      <div className="message-item-title">Staff Conversations</div>
                    </div>

                    <div
                      className="message-item-card"
                      onClick={() => setSubView('messages_empty')}
                    >
                      <div className="circle-icon-purple">
                        <Mail size={22} />
                      </div>
                      <div className="message-item-title">Sent Messages</div>
                    </div>

                    {/* Red Floating Action Button */}
                    <button
                      className="fab-btn"
                      onClick={() => setActiveModal('compose_msg')}
                      title="Compose New Message"
                    >
                      <Plus size={28} />
                    </button>
                  </div>
                )}

                {/* TAB 3: NOTIFICATIONS */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="messages-header-white">
                      Notifications
                    </div>

                    <div
                      style={{
                        padding: '20px 16px',
                        background: '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSubView('circulars_list')}
                    >
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                        {unreadCircularCount > 0
                          ? `You have ${unreadCircularCount} new Circulars`
                          : 'No new Circulars'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>
                        Tap here to view them
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PROFILE */}
                {activeTab === 'profile' && (
                  <div>
                    {/* Blue Banner Header - PRESS AND HOLD TO EDIT OR CLICK SUBTITLE TO VIEW PERSONAL INFO */}
                    <div
                      className="blue-banner-header"
                      onMouseDown={handlePressStart}
                      onMouseUp={handlePressEnd}
                      onTouchStart={handlePressStart}
                      onTouchEnd={handlePressEnd}
                      onDoubleClick={openEditModal}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    // title="Press & hold or double click to edit details"
                    >
                      <div
                        className="banner-photo-wrapper"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        <img src={studentPhoto} alt={studentName} className="banner-photo-img" onDoubleClick={(e) => { e.stopPropagation(); openEditModal(); }} />
                      </div>

                      <div
                        className="banner-student-name"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        {studentName}
                      </div>

                      <div
                        className="banner-roll-info"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        Roll. No: {rollNumber}, {semesterInfo}
                      </div>
                      <div
                        className="banner-subtitle-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        Profile
                      </div>
                    </div>

                    <div className="section-container">
                      <div className="section-heading">Settings</div>

                      <div className="grid-3-col">
                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('session_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/SESSION.png" alt="Session" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                          </div>
                          <span className="grid-card-label">Session</span>
                        </div>

                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('change_password_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/CHANGEPASSWORD.jpg" alt="Change Password" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                          </div>
                          <span className="grid-card-label">Change Password</span>
                        </div>

                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('privacy_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/PRIVACY.jpg" alt="Privacy" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                          </div>
                          <span className="grid-card-label">Privacy</span>
                        </div>

                        <div
                          className="grid-card-item"
                          onClick={() => { }}
                        >
                          <div className="grid-card-icon" />
                          <span className="grid-card-label">Reset Notifications</span>
                        </div>

                        <div
                          className="grid-card-item"
                          onClick={handleLogout}
                        >
                          <div className="grid-card-icon">
                            <img src="/logout_icon.png" alt="Logout" />
                          </div>
                          <span className="grid-card-label">Logout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: MENU */}
                {activeTab === 'menu' && (
                  <div>
                    {/* Blue Student Header Banner - PRESS AND HOLD TO EDIT OR CLICK SUBTITLE TO VIEW PERSONAL INFO */}
                    <div
                      className="blue-banner-header"
                      onMouseDown={handlePressStart}
                      onMouseUp={handlePressEnd}
                      onTouchStart={handlePressStart}
                      onTouchEnd={handlePressEnd}
                      onDoubleClick={openEditModal}
                      style={{ cursor: 'pointer', position: 'relative' }}
                      title="Press & hold or double click to edit details"
                    >
                      <div
                        className="banner-photo-wrapper"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        <img src={studentPhoto} alt={studentName} className="banner-photo-img" onDoubleClick={(e) => { e.stopPropagation(); openEditModal(); }} />
                      </div>

                      <div
                        className="banner-student-name"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        {studentName}
                      </div>

                      <div
                        className="banner-roll-info"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                      >
                        Roll. No: {rollNumber}, {semesterInfo}
                      </div>
                      <div
                        className="banner-subtitle-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView('personal_info');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        Student
                      </div>
                    </div>

                    <div className="section-container">

                      {/* SECTION 1: FREQUENTLY USED */}
                      <div className="section-heading">Frequently Used</div>
                      <div className="grid-3-col">
                        <div className="grid-card-item" onClick={() => setSubView('view_details_gatepass_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="View Details Gatepass" />
                          </div>
                          <span className="grid-card-label">View Details Gatepass</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('gradecard_view')}>
                          <div className="grid-card-icon">
                            <img src="/GRADECARD.png" alt="Grade Card" />
                          </div>
                          <span className="grid-card-label">Grade Card</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('apply_leave_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="Apply Duty/Medical Leave" />
                          </div>
                          <span className="grid-card-label">Apply Duty/Medical Leave</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('apply_gatepass_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="Apply Gatepass" />
                          </div>
                          <span className="grid-card-label">Apply Gatepass</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('fee_payment_history_view')}>
                          <div className="grid-card-icon">
                            <img src="/FEEPAYMENTHISTORY.png" alt="Fee Payment History" />
                          </div>
                          <span className="grid-card-label">Fee Payment History</span>
                        </div>
                      </div>

                      {/* SECTION 2: ACADEMICS */}
                      <div className="section-heading">Academics</div>
                      <div className="grid-3-col">
                        <div className="grid-card-item" onClick={() => setSubView('timetable_view')}>
                          <div className="grid-card-icon">
                            <img src="/ATTENDANCE.png" alt="Time Table" />
                          </div>
                          <span className="grid-card-label">Time Table</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('attendance_view')}>
                          <div className="grid-card-icon">
                            <img src="/ATTENDANCESUBJECTWISE.png" alt="Attendance Subjectwise" />
                          </div>
                          <span className="grid-card-label">Attendance Subjectwise</span>
                        </div>

                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('subjects_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/SUBJECTS.png" alt="Subjects" />
                          </div>
                          <span className="grid-card-label">Subjects</span>
                        </div>
                      </div>

                      {/* SECTION 3: EXAMINATION */}
                      <div className="section-heading">Examination</div>
                      <div className="grid-3-col">
                        <div className="grid-card-item" onClick={() => setSubView('gradecard_view')}>
                          <div className="grid-card-icon">
                            <img src="/GRADECARD.png" alt="Grade Card" />
                          </div>
                          <span className="grid-card-label">Grade Card</span>
                        </div>
                      </div>

                      {/* SECTION 4: FEES */}
                      <div className="section-heading">Fees</div>
                      <div className="grid-3-col" style={{ marginBottom: '14px' }}>
                        <div className="grid-card-item" onClick={() => setSubView('fee_payment_history_view')}>
                          <div className="grid-card-icon">
                            <img src="/FEEPAYMENTHISTORY.png" alt="Fee Payment History" />
                          </div>
                          <span className="grid-card-label">Fee Payment History</span>
                        </div>
                      </div>

                      {/* VERTICAL SEMESTER FEE CARDS STACK */}
                      <div className="vertical-fee-container">
                        <div
                          className="vertical-fee-card"
                          onClick={() => setSubView('no_fee_due')}
                        >
                          <div className="grid-card-icon">
                            <img src="/FEESFORSEM.jpg" alt="Fee for Jul-Dec2024" />
                          </div>
                          <span className="grid-card-label">Fee for Jul-Dec2024</span>
                        </div>

                        <div
                          className="vertical-fee-card"
                          onClick={() => setSubView('no_fee_due')}
                        >
                          <div className="grid-card-icon">
                            <img src="/FEESFORSEM.jpg" alt="Fee for JanJun2025" />
                          </div>
                          <span className="grid-card-label">Fee for JanJun2025</span>
                        </div>

                        <div
                          className="vertical-fee-card"
                          onClick={() => setSubView('no_fee_due')}
                        >
                          <div className="grid-card-icon">
                            <img src="/FEESFORSEM.jpg" alt="Fee for Jul-Dec2025" />
                          </div>
                          <span className="grid-card-label">Fee for Jul-Dec2025</span>
                        </div>

                        <div
                          className="vertical-fee-card"
                          onClick={() => setSubView('no_fee_due')}
                        >
                          <div className="grid-card-icon">
                            <img src="/FEESFORSEM.jpg" alt="Fee for JanJun2026" />
                          </div>
                          <span className="grid-card-label">Fee for JanJun2026</span>
                        </div>
                      </div>

                      {/* SECTION 5: LEAVE */}
                      <div className="section-heading">Leave</div>
                      <div className="grid-3-col">
                        <div className="grid-card-item" onClick={() => setSubView('apply_leave_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="Apply Duty/Medical Leave" />
                          </div>
                          <span className="grid-card-label">Apply Duty/Medical Leave</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('apply_gatepass_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="Apply Gatepass" />
                          </div>
                          <span className="grid-card-label">Apply Gatepass</span>
                        </div>

                        <div className="grid-card-item" onClick={() => setSubView('view_details_gatepass_view')}>
                          <div className="grid-card-icon">
                            <img src="/APPLYGPMEDICAL.png" alt="View Details Gatepass" />
                          </div>
                          <span className="grid-card-label">View Details Gatepass</span>
                        </div>
                      </div>

                      {/* SECTION 6: FEEDBACK */}
                      <div className="section-heading">Feedback</div>
                      <div className="grid-3-col">
                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('student_survey_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/STUDENTEXPERIENCESURVEY.png" alt="Student Experience Survey" />
                          </div>
                          <span className="grid-card-label">Student Experience Survey</span>
                        </div>
                      </div>

                      {/* SECTION 7: NO DUES VERIFICATION */}
                      <div className="section-heading">No Dues Verification</div>
                      <div className="grid-3-col">
                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('no_dues_view')}
                        >
                          <div className="grid-card-icon">
                            <img src="/NODUESVERIFICATION.png" alt="No Dues Verification" />
                          </div>
                          <span className="grid-card-label">No Dues Verification</span>
                        </div>
                      </div>

                      {/* SECTION 8: GREETINGS */}
                      <div className="section-heading">Greetings</div>
                      <div className="grid-3-col">
                        <div
                          className="grid-card-item"
                          onClick={() => setSubView('greetings_view')}
                        >
                          <div className="grid-card-icon">{renderGreetingsIcon()}</div>
                          <span className="grid-card-label">My Greetings</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </>
            ))}
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        {isLoggedIn && currentView === 'main' && (
          <div className="bottom-nav">
            <button
              className={`nav-item ${activeTab === 'timeline' && !subView ? 'active' : ''}`}
              onClick={() => { setActiveTab('timeline'); setSubView(null); }}
            >
              <img src="/TIMELINE.png" alt="Timeline" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span>Timeline</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'messages' && !subView ? 'active' : ''}`}
              onClick={() => { setActiveTab('messages'); setSubView(null); }}
            >
              <img src="/MESSAGES.jpg" alt="Messages" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span>Messages</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'notifications' && !subView ? 'active' : ''}`}
              onClick={() => { setActiveTab('notifications'); setSubView(null); }}
            >
              <img src="/NOTIFICATIONS.svg" alt="Notifications" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span>Notifications</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'profile' && !subView ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSubView(null); }}
            >
              <img src="/PROFILE.png" alt="Profile" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span>Profile</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'menu' && !subView ? 'active' : ''}`}
              onClick={() => { setActiveTab('menu'); setSubView(null); }}
            >
              <img src="/MENU.png" alt="Menu" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              <span>Menu</span>
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* EDIT PROFILE / HEADER MODAL */}
        {/* ==================================================== */}
        {activeModal === 'edit_profile' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Edit Header & Student Details</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveProfileEdits} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Profile Photo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <img
                      src={editFormPhoto || studentPhoto}
                      alt="Profile Preview"
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
                    />
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor="photo-upload-input"
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '8px 14px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Upload size={16} />
                        Upload New Photo
                      </label>
                      <input
                        id="photo-upload-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditFormPhoto(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>PNG, JPG or WebP images supported</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={editFormName}
                    onChange={(e) => setEditFormName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 600 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={editFormRoll}
                    onChange={(e) => setEditFormRoll(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Batch / Semester Tag
                  </label>
                  <input
                    type="text"
                    value={editFormSem}
                    onChange={(e) => setEditFormSem(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editFormMobile}
                    onChange={(e) => setEditFormMobile(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormEmail}
                    onChange={(e) => setEditFormEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Date of Birth (D.O.B.)
                  </label>
                  <input
                    type="text"
                    value={editFormDob}
                    onChange={(e) => setEditFormDob(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={editFormBlood}
                    onChange={(e) => setEditFormBlood(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={editFormFather}
                    onChange={(e) => setEditFormFather(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    value={editFormMother}
                    onChange={(e) => setEditFormMother(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    value={editFormAddress}
                    onChange={(e) => setEditFormAddress(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setActiveModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODALS AND INTERACTIVE FEATURE POPUPS */}
        {activeModal === 'notice_detail' && selectedNotice && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">{selectedNotice.type} Details</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{selectedNotice.title}</h3>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Published Date: {selectedNotice.date}</div>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                {selectedNotice.content}
              </p>
              <button
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => alert('Downloading official PDF document attachment...')}
              >
                <Download size={18} />
                <span>Download Attachment (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {activeModal === 'chat_detail' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">
                  {chatType === 'staff' ? 'Staff Conversations' : 'Sent Messages'}
                </span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              {chatType === 'staff' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Dr. Rajesh Kumar (HOD CSE)</div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                      "Your duty leave request for ACM Hackathon has been approved."
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Yesterday, 4:15 PM</div>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Prof. Meenakshi (OS Instructor)</div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                      "Please upload your UNIX shell lab assignment before Friday."
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>02 Oct 2026</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e40af' }}>To: Mentor Office</div>
                    <div style={{ fontSize: '13px', color: '#1e3a8a', marginTop: '4px' }}>
                      "Subject: Request for Gatepass approval for weekend extension."
                    </div>
                    <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>Status: Delivered</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeModal === 'compose_msg' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Compose Message to Faculty</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Select Department / Staff</label>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option>HOD CSE Office</option>
                  <option>Academic Coordinator</option>
                  <option>Hostel Warden</option>
                  <option>Accounts & Fee Section</option>
                </select>

                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Subject</label>
                <input
                  type="text"
                  placeholder="Enter message title..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />

                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message details..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                ></textarea>

                <button
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onClick={() => {
                    alert('Message dispatched to faculty successfully.');
                    setActiveModal(null);
                  }}
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'attendance' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Attendance Subjectwise (BE CSE 5th Sem)</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Overall Attendance</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#065f46' }}>87.4%</div>
                </div>
                <div style={{ background: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                  Eligible for Exams
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {[
                  { name: 'Operating Systems & Kernel', code: 'CSE-501', attended: 42, total: 48, pct: 87.5 },
                  { name: 'Database Management Systems', code: 'CSE-502', attended: 45, total: 50, pct: 90.0 },
                  { name: 'Computer Networks & Security', code: 'CSE-503', attended: 36, total: 44, pct: 81.8 },
                  { name: 'Web Development & Microservices', code: 'CSE-504', attended: 38, total: 40, pct: 95.0 },
                  { name: 'Theory of Computation', code: 'CSE-505', attended: 33, total: 40, pct: 82.5 }
                ].map(sub => (
                  <div key={sub.code} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
                      <span>{sub.name}</span>
                      <span style={{ color: sub.pct >= 85 ? '#10b981' : '#f59e0b' }}>{sub.pct}%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Attended: {sub.attended} / {sub.total} Lectures
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${sub.pct}%`, height: '100%', background: sub.pct >= 85 ? '#10b981' : '#f59e0b' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'timetable' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Weekly Time Table (Curie Block 304)</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af' }}>09:00 AM - 10:00 AM</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Operating Systems (L)</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Prof. Meenakshi • Hall 304</div>
                </div>

                <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400e' }}>10:00 AM - 12:00 PM</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Database Lab (G1)</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Dr. A. Sharma • Turing Lab 2</div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#166534' }}>01:00 PM - 03:00 PM</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Web Development Workshop</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Er. Pankaj • Apple Lab</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'gradecard' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Cumulative Grade Card</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Cumulative Grade Point Average (CGPA)</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>8.92</div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>First Class with Distinction</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { sem: 'Semester 1', sgpa: '8.80', status: 'Passed' },
                  { sem: 'Semester 2', sgpa: '9.10', status: 'Passed' },
                  { sem: 'Semester 3', sgpa: '8.75', status: 'Passed' },
                  { sem: 'Semester 4', sgpa: '9.05', status: 'Passed' }
                ].map(g => (
                  <div key={g.sem} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{g.sem}</span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#2563eb' }}>SGPA: {g.sgpa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'gatepass' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Outing Gatepass System</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#1e40af', fontSize: '14px' }}>Active Pass #GP-9821</span>
                  <span style={{ background: '#10b981', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>APPROVED</span>
                </div>
                <div style={{ fontSize: '12px', color: '#1e3a8a', marginTop: '6px' }}>Outing Date: 06-10-2026 • 05:00 PM to 08:30 PM</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Approved by: Warden Block 4</div>
              </div>

              <button
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() => alert('New Outing Request Submitted to Hostel Warden.')}
              >
                Apply New Gatepass
              </button>
            </div>
          </div>
        )}

        {activeModal === 'fee_history' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Fee Payment History</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
                    <span>Semester 5 Academic Fee</span>
                    <span style={{ color: '#10b981' }}>PAID (₹ 98,500)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Txn Ref: HDFC-9812401859 • Date: 28-05-2026</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
                    <span>Semester 4 Academic Fee</span>
                    <span style={{ color: '#10b981' }}>PAID (₹ 98,500)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Txn Ref: HDFC-7128491023 • Date: 05-12-2025</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'duty_leave' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">Apply Duty / Medical Leave</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Leave Type</label>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option>Duty Leave (Academic Event / Hackathon)</option>
                  <option>Medical Leave</option>
                  <option>Sports Leave</option>
                </select>

                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Event / Reason Description</label>
                <input
                  type="text"
                  placeholder="e.g. Participated in Inter-University Hackathon"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />

                <button
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    alert('Duty Leave application submitted to Academic HOD.');
                    setActiveModal(null);
                  }}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'settings_item' && selectedNotice && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title">{selectedNotice.title}</span>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {selectedNotice.content}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
