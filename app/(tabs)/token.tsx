import { useQueue } from '@/lib/queue-context';
import ActiveTokenScreen from '@/app/active-token';
import EmergencyFlow from '@/app/emergency';

export default function TokenTab() {
    const { activeBooking } = useQueue();
    
    if (!activeBooking) {
        return <EmergencyFlow />;
    }
    
    return <ActiveTokenScreen />;
}
