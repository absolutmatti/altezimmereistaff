// utils/mockData.js

export const mockUsers = [
    {
      id: "staff1",
      name: "Max Mustermann",
      profileImage: "https://ui-avatars.com/api/?name=Max+Mustermann",
      role: "Manager"
    },
    {
      id: "staff2",
      name: "Erika Musterfrau",
      profileImage: "https://ui-avatars.com/api/?name=Erika+Musterfrau",
      role: "Mitarbeiter"
    },
    {
      id: "staff3",
      name: "Thomas Schmidt",
      profileImage: "https://ui-avatars.com/api/?name=Thomas+Schmidt",
      role: "Mitarbeiter"
    }
  ];
  
  export const mockNewsPosts = [
    {
      id: "news1",
      title: "Neue Öffnungszeiten ab Januar",
      content: "Ab Januar 2025 ändern sich unsere Öffnungszeiten. Montag bis Freitag sind wir von 8:00 bis 18:00 Uhr für Sie da. Samstags von 9:00 bis 14:00 Uhr.",
      author: mockUsers[0],
      createdAt: "2024-12-18T10:30:00Z",
      updatedAt: "2024-12-18T10:30:00Z",
      categories: ["Allgemein", "Wichtig"],
      commentCount: 5,
      important: true,
      pinned: true,
      hasVoting: false,
      mediaUrl: null
    },
    {
      id: "news2",
      title: "Teambuilding Event im Februar",
      content: "Wir planen ein Teambuilding-Event im Februar. Bitte tragt euch in die Liste ein, wer teilnehmen möchte. Wir werden einen Ausflug in den Kletterwald machen.",
      author: mockUsers[0],
      createdAt: "2024-12-15T14:20:00Z",
      updatedAt: "2024-12-15T14:20:00Z",
      categories: ["Event", "Team"],
      commentCount: 12,
      important: false,
      pinned: false,
      hasVoting: true,
      mediaUrl: "https://picsum.photos/seed/event1/800/600"
    },
    {
      id: "news3",
      title: "Neue Arbeitskleidung ist eingetroffen",
      content: "Die neue Arbeitskleidung ist eingetroffen und kann ab sofort im Lager abgeholt werden. Bitte kommt einzeln vorbei und probiert alles direkt an, damit wir ggf. Änderungen vornehmen können.",
      author: mockUsers[1],
      createdAt: "2024-12-10T09:15:00Z",
      updatedAt: "2024-12-10T09:15:00Z",
      categories: ["Ausstattung"],
      commentCount: 3,
      important: false,
      pinned: false,
      hasVoting: false,
      mediaUrl: null
    }
  ];
  
  export const mockGeneralPosts = [
    {
      id: "general1",
      content: "Hat jemand ein Akkuschrauber gesehen? Ich kann meinen nicht finden und brauche ihn dringend für den Aufbau der neuen Regale.",
      author: mockUsers[2],
      createdAt: "2024-12-19T08:45:00Z",
      updatedAt: "2024-12-19T08:45:00Z",
      categories: ["Werkzeug", "Frage"],
      commentCount: 4,
      mediaUrl: null,
      reactions: {
        "👍": 3,
        "❤️": 0,
        "😂": 2,
        "😢": 0,
        "😠": 0
      }
    },
    {
      id: "general2",
      content: "Heute Abend gibt es eine spontane Grillfeier hinter der Werkstatt. Jeder ist herzlich eingeladen! Bringt bitte Getränke oder Salate mit.",
      author: mockUsers[1],
      createdAt: "2024-12-18T16:30:00Z",
      updatedAt: "2024-12-18T16:30:00Z",
      categories: ["Sozial", "Event"],
      commentCount: 8,
      mediaUrl: "https://picsum.photos/seed/bbq/800/600",
      reactions: {
        "👍": 12,
        "❤️": 5,
        "😂": 0,
        "😢": 0,
        "😠": 0
      }
    },
    {
      id: "general3",
      content: "Ich habe mein Mittagessen in der Küche vergessen. Falls jemand einen Tupperware mit Nudelsalat findet, bitte im Kühlschrank aufbewahren. Danke!",
      author: mockUsers[0],
      createdAt: "2024-12-17T12:10:00Z",
      updatedAt: "2024-12-17T12:10:00Z",
      categories: ["Persönlich"],
      commentCount: 2,
      mediaUrl: null,
      reactions: {
        "👍": 1,
        "❤️": 0,
        "😂": 6,
        "😢": 2,
        "😠": 0
      }
    }
  ];

  export const mockEvents = [
      {
        id: "event1",
        name: "Mitarbeiterschulung",
        date: "2025-03-25T00:00:00Z",
        startTime: "10:00",
        endTime: "16:00",
        location: "Hauptwerkstatt",
        description: "Jährliche Sicherheitsunterweisung für alle Mitarbeiter",
        organizer: mockUsers[0],
        attendees: [mockUsers[0], mockUsers[1], mockUsers[2]]
      },
      {
        id: "event2",
        name: "Firmenjubiläum",
        date: "2025-04-15T00:00:00Z",
        startTime: "18:00",
        endTime: "22:00",
        location: "Restaurante Bella Vista",
        description: "Feier zum 10-jährigen Bestehen der Alten Zimmerei",
        organizer: mockUsers[0],
        attendees: [mockUsers[0], mockUsers[1], mockUsers[2]]
      },
      {
        id: "event3",
        name: "Kundenpräsentation",
        date: "2025-03-20T00:00:00Z",
        startTime: "14:00",
        endTime: "16:00",
        location: "Besprechungsraum 1",
        description: "Vorstellung der neuen Produktlinie für Bauprojekte",
        organizer: mockUsers[1],
        attendees: [mockUsers[0], mockUsers[1]]
      }
    ];
    
    // Beispiel-Besprechungen
    export const mockMeetings = [
      {
        id: "meeting1",
        title: "Wöchentliche Teambesprechung",
        date: "2025-03-18T00:00:00Z",
        startTime: "09:00",
        endTime: "10:00",
        location: "Besprechungsraum 2",
        description: "Wöchentliches Update zu laufenden Projekten",
        organizer: mockUsers[0],
        attendees: [
          { user: mockUsers[0], status: "attending" },
          { user: mockUsers[1], status: "attending" },
          { user: mockUsers[2], status: "attending" }
        ],
        agenda: [
          "Status Update zu Projekten",
          "Neue Aufgaben verteilen",
          "Fragen und Antworten"
        ],
        recurring: true,
        recurrencePattern: "weekly"
      },
      {
        id: "meeting2",
        title: "Strategie-Meeting Q1",
        date: "2025-03-31T00:00:00Z",
        startTime: "13:00",
        endTime: "15:00",
        location: "Besprechungsraum 1",
        description: "Planung für das zweite Quartal 2025",
        organizer: mockUsers[0],
        attendees: [
          { user: mockUsers[0], status: "attending" },
          { user: mockUsers[1], status: "attending" },
          { user: mockUsers[2], status: "declined" }
        ],
        agenda: [
          "Rückblick Q1",
          "Ziele für Q2",
          "Budget-Planung"
        ],
        recurring: false
      },
      {
        id: "meeting3",
        title: "Kundenfeedback-Besprechung",
        date: "2025-03-22T00:00:00Z",
        startTime: "11:00",
        endTime: "12:00",
        location: "Online (Zoom)",
        description: "Analyse der Kundenfeedback-Umfrage vom letzten Monat",
        organizer: mockUsers[1],
        attendees: [
          { user: mockUsers[0], status: "tentative" },
          { user: mockUsers[1], status: "attending" },
          { user: mockUsers[2], status: "attending" }
        ],
        agenda: [
          "Präsentation der Umfrageergebnisse",
          "Identifikation von Verbesserungspotential",
          "Nächste Schritte"
        ],
        recurring: false
      }
    ];
    
    // Beispiel-Dienstplan
    export const mockSchedule = {
      month: "März 2025",
      days: [
        {
          date: "2025-03-18T00:00:00Z",
          shifts: [
            {
              id: "shift1",
              type: "Frühdienst",
              startTime: "07:00",
              endTime: "15:00",
              staff: mockUsers[0]
            },
            {
              id: "shift2",
              type: "Spätdienst",
              startTime: "15:00",
              endTime: "23:00",
              staff: mockUsers[1]
            }
          ]
        },
        {
          date: "2025-03-19T00:00:00Z",
          shifts: [
            {
              id: "shift3",
              type: "Frühdienst",
              startTime: "07:00",
              endTime: "15:00",
              staff: mockUsers[1]
            },
            {
              id: "shift4",
              type: "Spätdienst",
              startTime: "15:00",
              endTime: "23:00",
              staff: mockUsers[2]
            }
          ]
        },
        {
          date: "2025-03-20T00:00:00Z",
          shifts: [
            {
              id: "shift5",
              type: "Frühdienst",
              startTime: "07:00",
              endTime: "15:00",
              staff: mockUsers[2]
            },
            {
              id: "shift6",
              type: "Spätdienst",
              startTime: "15:00",
              endTime: "23:00",
              staff: mockUsers[0]
            }
          ]
        },
        {
          date: "2025-03-21T00:00:00Z",
          shifts: [
            {
              id: "shift7",
              type: "Eventbetreuung",
              startTime: "14:00",
              endTime: "22:00",
              staff: mockUsers[0],
              eventId: "event3"
            },
            {
              id: "shift8",
              type: "Spätdienst",
              startTime: "15:00",
              endTime: "23:00",
              staff: mockUsers[1]
            }
          ]
        }
      ]
    };
    
    // Beispiel-Verfügbarkeiten
    export const mockAvailability = [
      {
        id: "availability1",
        userId: "staff1",
        date: "2025-03-25T00:00:00Z",
        allDay: true,
        startTime: null,
        endTime: null,
        reason: "Urlaub"
      },
      {
        id: "availability2",
        userId: "staff2",
        date: "2025-03-22T00:00:00Z",
        allDay: false,
        startTime: "13:00",
        endTime: "17:00",
        reason: "Arzttermin"
      },
      {
        id: "availability3",
        userId: "staff1",
        date: "2025-03-26T00:00:00Z",
        allDay: true,
        startTime: null,
        endTime: null,
        reason: "Urlaub"
      },
      {
        id: "availability4",
        userId: "staff3",
        date: "2025-03-28T00:00:00Z",
        allDay: true,
        startTime: null,
        endTime: null,
        reason: "Fortbildung"
      }
    ];

      // Mock-Besprechungen
