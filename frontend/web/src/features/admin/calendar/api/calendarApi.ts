import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AdminEvent {
  id: string;
  title: string;
  type: 'platform' | 'promotion' | 'holiday' | 'maintenance';
  start: string;
  end: string;
  description: string;
}

const mockEvents: AdminEvent[] = [
  {
    id: 'evt_1',
    title: 'Black Friday Sale',
    type: 'promotion',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 86400000).toISOString(),
    description: 'Platform wide discount event'
  },
  {
    id: 'evt_2',
    title: 'System Maintenance',
    type: 'maintenance',
    start: new Date(Date.now() + 604800000).toISOString(),
    end: new Date(Date.now() + 604800000 + 7200000).toISOString(),
    description: 'Scheduled database upgrade'
  }
];

export const adminCalendarApi = createApi({
  reducerPath: 'adminCalendarApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/admin/calendar',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    getEvents: builder.query<AdminEvent[], void>({
      queryFn: () => ({ data: mockEvents }),
      providesTags: ['Events'],
    }),
    addEvent: builder.mutation<void, Partial<AdminEvent>>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useAddEventMutation,
} = adminCalendarApi;




