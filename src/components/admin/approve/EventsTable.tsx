'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { CSVLink } from 'react-csv';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import Image from 'next/image';
import { EventData, events } from '@/lib/types/events';
import TableSkeleton from './TableSkeleton';
import { useEvents } from '@/lib/stores';
import { toast } from 'sonner';
import { supabase } from '@/utils/functions/supabase-client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TeamMembersDialog } from './TeamMembersDialog';
import { approveRegistration } from '@/utils/functions/register-services';
import { Filter } from './EventFilters';
import { getRoles } from '@/utils/functions';
import { dateTime } from '@/utils/functions/dateUtils';

const COLUMN_WIDTHS = [
  100, 180, 400, 240, 220, 240, 240, 240, 360, 240, 320, 280,
];
const TABLE_WIDTH = COLUMN_WIDTHS.reduce((a, b) => a + b, 0);

export default function EventsTable() {
  const festId = '44bb2093-d229-4385-8f08-3fe7da3521c8';
  const [searchQuery, setSearchQuery] = useState('');
  const [rolesData, setRolesData] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [swcPaid, setSwcPaid] = useState(0);
  const [swcNotPaid, setSwcNotPaid] = useState(0);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [registeredAtFilter, setRegisteredAtFilter] = useState('');
  const {
    eventsData,
    approvalDashboardLoading,
    approvalDashboardData,
    getApprovalDashboardData,
  } = useEvents();

  const refreshData = async () => {
    getApprovalDashboardData(0, 1000);
  };
  useEffect(() => {
    refreshData();

    const getRolesData = async () => {
      const roles: any = await getRoles();
      const roles2 = roles.find((role: any) => role.role === 'super_admin');
      setRolesData(roles2);
    };
    getRolesData();
  }, []);

  const filteredData = useMemo(() => {
    return approvalDashboardData.filter((item) => {
      const searchMatch =
        !searchQuery ||
        (item.eventname ?? '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.teamleadphone ?? '').includes(searchQuery) ||
        (item.teamlead ?? '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.teamleademail ?? '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.college ?? '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.transactionid ?? '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const paymentStatusMatch =
        !paymentStatusFilter || item.paymentstatus === paymentStatusFilter;
      const eventMatch = !eventFilter || item.eventname === eventFilter;
      const typeMatch = !typeFilter || item.type === typeFilter;
      const collegeMatch = !collegeFilter || item.college === collegeFilter;

      const registeredAtMatch = (() => {
        if (!registeredAtFilter) return true;
        const now = new Date();
        const registeredDate = new Date(item.registeredat);
        const hoursDiff =
          (now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60);

        switch (registeredAtFilter) {
          case 'Last 24 hours':
            return hoursDiff <= 24;
          case 'Last 7 days':
            return hoursDiff <= 24 * 7;
          case 'Last 30 days':
            return hoursDiff <= 24 * 30;
          default:
            return true;
        }
      })();

      return (
        searchMatch &&
        paymentStatusMatch &&
        eventMatch &&
        typeMatch &&
        collegeMatch &&
        registeredAtMatch
      );
    });
  }, [
    approvalDashboardData,
    searchQuery,
    paymentStatusFilter,
    eventFilter,
    typeFilter,
    collegeFilter,
    registeredAtFilter,
  ]);

  useEffect(() => {
    const fetchMore = async () => {
      const totalMembers = filteredData?.reduce((sum, team) => {
        return sum + (team.teammembers?.length || 0);
      }, 0);
      return totalMembers;
    };

    fetchMore();
  }, [filteredData]);

  const uniqueEvents = useMemo(
    () =>
      Array.from(new Set(approvalDashboardData.map((item) => item.eventname))),
    [approvalDashboardData]
  );
  const uniqueTypes = useMemo(
    () => Array.from(new Set(approvalDashboardData.map((item) => item.type))),
    [approvalDashboardData]
  );
  const uniqueColleges = useMemo(
    () =>
      Array.from(new Set(approvalDashboardData.map((item) => item.college))),
    [approvalDashboardData]
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setPaymentStatusFilter('');
    setEventFilter('');
    setTypeFilter('');
    setCollegeFilter('');
    setRegisteredAtFilter('');
  };

  const [teamsWithMembers, setTeamsWithMembers] = useState<any[]>([]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const teamsWithMembersData = filteredData.flatMap((team, index) =>
        team.teammembers.map((member: any) => {
          const row: Record<string, any> = {
            'SL No.': index + 1,
            'Event Name': team.eventname,
            'Team Name': team.teamname || 'N/A',
            Name: member.name,
            Phone: member.phone,
            Email: member.email,
            College: team.college,
            'College Roll (For RCCIIT Students)': '',
            Attendance: '',
          };

          if (team.type === 'Individual') {
            delete row['Team Name'];
          }

          return row;
        })
      );
      setTeamsWithMembers(teamsWithMembersData);
    }
  }, [filteredData]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = filteredData[index];
    console.log(item);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
      <div
        style={{ ...style, width: TABLE_WIDTH }}
        className="flex items-center border-b border-gray-800 hover:bg-[#131926] transition-colors"
      >
        {COLUMN_WIDTHS.map((width, colIndex) => (
          <div
            key={colIndex}
            className="p-4 flex-none text-gray-100"
            style={{ width: width }}
          >
            {colIndex === 0 ? (
              item.serial_no
            ) : colIndex === 1 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`px-2 py-1 rounded-md font-medium cursor-pointer ${
                        item.paymentstatus === 'Verified'
                          ? 'bg-[#132F21] text-[#4ADE80] border border-[#4ADE80]/20'
                          : 'bg-[#2A1215] text-[#F87171] border border-[#F87171]/20'
                      }`}
                      onClick={() =>
                        // item.paymentstatus === 'Not Verified' &&
                        setIsDialogOpen(true)
                      }
                    >
                      {item.paymentstatus}
                    </span>
                  </TooltipTrigger>
                  {item.paymentstatus === 'Not Verified' && (
                    <TooltipContent>
                      <p>Click to see screenshot</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : colIndex === 2 ? (
              item.eventname
            ) : colIndex === 3 ? (
              <span className="px-2 py-1 rounded-md bg-[#1F2937] text-gray-300">
                {item.type}
              </span>
            ) : colIndex === 4 ? (
              item.teamname
            ) : colIndex === 5 ? (
              item.college
            ) : colIndex === 6 ? (
              item.teamlead
            ) : colIndex === 7 ? (
              item.teamleadphone
            ) : colIndex === 8 ? (
              item.teamleademail
            ) : colIndex === 9 ? (
              <span className="font-mono text-gray-300">
                {item.transactionid}
              </span>
            ) : colIndex === 10 ? (
              <div className="min-w-[300px]">
                <TeamMembersDialog members={item.teammembers} teamID={item.team_id} />
              </div>
            ) : (
              <span className="text-gray-400">
                {item.registeredat?.split('T')[0]}
              </span>
            )}
          </div>
        ))}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[60vh] bg-[#250c0c] font-antolia overflow-y-scroll my-scrollbar">
            <DialogHeader>
              <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
                Transaction Screenshot
              </h1>
            </DialogHeader>
            {!item.transaction_screenshot ? (
              <div className="flex flex-col items-center justify-center gap-2 text-red-600 font-semibold">
                SWC Paid Transaction !
              </div>
            ) : (
              <Image
                src={item.transaction_screenshot || '/placeholder.svg'}
                alt="Transaction Screenshot"
                layout="responsive"
                loading="lazy"
                width={800}
                height={600}
                objectFit="contain"
              />
            )}
            {rolesData && (
              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const eventCoordinators = eventsData?.find(
                        (event: events) => event.name === item.eventname
                      )?.coordinators;
                      const approvalData = await approveRegistration(
                        item.team_id
                      );
                      const emailData = {
                        eventName: item.eventname,
                        year: '2025',
                        festName: 'Regalia',
                        teamName: item.teamname,
                        leaderName: item.teamlead,
                        leaderPhone: item.teamleadphone,
                        email: item.teamleademail,
                        whatsappLink: '#',
                        teamMembers: item.teammembers,
                        coordinators: eventCoordinators,
                        contactEmail: 'regalia.rcciit.official@gmail.com',
                        logoUrl:
                          'https://i.postimg.cc/dQZZWTRd/regalia-2025-2.png',
                      };
                      const emailResponse = await fetch('/api/sendMail', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          to: [
                            item.teamleademail,
                            ...item.teammembers.map(
                              (member: any) => member.email
                            ),
                          ],
                          subject: `🎉 Registration Confirmed: ${item.eventname} - REGALIA 2025`,
                          fileName: 'verify-email.ejs',
                          data: emailData,
                        }),
                      });
                      refreshData();
                      toast.success('Payment Accepted Successfully');
                      setIsDialogOpen(false);
                    } catch (error) {
                      toast.error('Error in accepting the payment');
                    }
                  }}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
            {/* <Button onClick={() => setIsDialogOpen(false)} className="mt-4">
              Close
            </Button> */}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  if (approvalDashboardLoading) return <TableSkeleton />;

  // const [showNext, setShowNext] = useState(true);

  // useEffect(()=>{
  //   if(showNext){
  //     getApprovalDashboardData(0, 1000);
  //   }else  {
  //     getApprovalDashboardData(1000,2000);
  //   }
  // },[showNext])

  return (
    <div className="space-y-4">
      <CSVLink
        data={teamsWithMembers}
        filename={`registrations-${dateTime()}.csv`}
        className="w-fit-content rounded-md px-4 py-2 tracking-wider bg-regalia text-sm lg:text-lg font-semibold font-kagitingan border-yellow-200 text-white hover:border-regalia hover:text-regalia hover:bg-black border"
      >
        Download CSV
      </CSVLink>
      {/* <Button onClick={()=>{
        setShowNext(!showNext)
      }} className="w-fit-content rounded-md px-4 py-2 tracking-wider bg-regalia text-sm lg:text-lg font-semibold font-kagitingan border-yellow-200 text-white hover:border-regalia hover:text-regalia hover:bg-black border">
        {!showNext  ? "Back" : "Next"}
      </Button> */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by event name, phone, team lead, email, college, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-3 bg-[#1F2937] text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button
            onClick={refreshData}
            variant="outline"
            className="bg-[#1F2937] border-gray-700 hover:bg-[#2D3748] hover:text-white text-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Filter
          options={['Verified', 'Not Verified']}
          value={paymentStatusFilter}
          onChange={setPaymentStatusFilter}
          placeholder="Payment Status"
        />
        <Filter
          options={uniqueEvents}
          value={eventFilter}
          onChange={setEventFilter}
          placeholder="Event"
        />
        <Filter
          options={uniqueTypes}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Type"
        />
        <Filter
          options={uniqueColleges}
          value={collegeFilter}
          onChange={setCollegeFilter}
          placeholder="College"
        />
        <Filter
          options={['Last 24 hours', 'Last 7 days', 'Last 30 days']}
          value={registeredAtFilter}
          onChange={setRegisteredAtFilter}
          placeholder="Registered At"
        />
        <Button
          onClick={clearAllFilters}
          variant="outline"
          disabled={
            !searchQuery &&
            !paymentStatusFilter &&
            !eventFilter &&
            !typeFilter &&
            !collegeFilter &&
            !registeredAtFilter
          }
          className="bg-[#1F2937] border-gray-700 hover:bg-[#2D3748] hover:text-white text-gray-300 disabled:cursor-not-allowed"
        >
          Clear All Filters
        </Button>
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-lg bg-[#0B0F17]">
        <div style={{ width: TABLE_WIDTH }}>
          <div className="sticky top-0 z-10 flex items-center font-bold border-b border-gray-800 bg-[#0B0F17]">
            {[
              'SL No.',
              'Payment Status',
              'Event Name',
              'Type',
              'Team Name',
              'College',
              'Team Lead',
              'Phone',
              'Email',
              'Transaction ID',
              'Members',
              'Registered At',
            ].map((header, index) => (
              <div
                key={index}
                className="p-4 flex-none text-gray-100"
                style={{ width: COLUMN_WIDTHS[index] }}
              >
                {header}
              </div>
            ))}
          </div>
          <div style={{ height: '600px', width: '103%' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  itemCount={filteredData.length}
                  itemSize={50}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
}
