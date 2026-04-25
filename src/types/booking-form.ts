export type BookingSessionType = {
  id: string;
  label: string;
  description: string;
  duration: string;
  price: number;
  icon: React.ReactNode;
};

export type BookingTimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

export type BookingFormState = {
  sessionType: string;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
};
