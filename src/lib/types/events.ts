export interface Link {
    title: string;
    url: string;
  }
  
  export interface Coordinator {
    name: string;
    phone: string;
  }
  
  export interface events {
    id: string;
    name: string;
    reg_status: boolean;
    registration_fees: number;
    prize_pool: number;
    image_url: string;
    min_team_size: number;
    max_team_size: number;
    schedule: string;
    description: string;
    rules: string;
    coordinators: {
      name: string;
      phone: string;
    }[];
    links: {
      title: string;
      url: string;
    }[];
    registered?: boolean;
  }
  
  // The state interface for events.
  export interface EventsStateType {
    eventsData: events[];
    eventsLoading: boolean;
  }
  
  // The actions interface for events.
  export interface EventsActionsType {
    setEventsData: () => void;
    markEventAsRegistered: (eventId: string) => void;
    updateEventsData: (id: string, data: any) => void;
    updateRegisterStatus: (id: string, status: boolean) => void;
  }