import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import useGetNotification from '../Hooks/MusicHooks/getNotification'

export const NotificationListener = () => {

    const { data } = useGetNotification();
    const notify = data?.[0] || []

    const previousNotifications = useRef([]);

    useEffect(() => {

        if (!notify) return;

        const currentNotifications = notify;

        const oldLength =
            previousNotifications.current.length;

        const newLength =
            currentNotifications.length;

        // New notification arrived
        if (newLength > oldLength) {

            const latestNotification =
                currentNotifications[0];

            showNotificationToast(latestNotification);
        }

        previousNotifications.current =
            currentNotifications;

    }, [notify]);

    return null;
};


const showNotificationToast = (notification) => {

    toast.custom((t) => (

        <div
            className={`
                bg-zinc-900
                text-white
                px-4
                py-3
                rounded-2xl
                shadow-2xl
                flex
                items-center
                gap-3
                w-[320px]
                border
                border-white/10
                transition-all
                ${t.visible ? "animate-enter" : "animate-leave"}
            `}
        >

            {/* Profile Image */}
            <img
                src={notification.ProfilePic}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex-1">

                <p className="text-sm font-semibold">
                    {notification.Username}
                </p>

                <p className="text-xs text-zinc-300">

                    {notification.Type === "follow" &&
                        "started following you"}

                    {notification.Type === "like" &&
                        "liked your music"}

                    {notification.Type === "comment" &&
                        "commented on your music"}

                </p>

            </div>

            {/* Close Button */}
            <button
                onClick={() => toast.dismiss(t.id)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-90"
            >
                <X size={14} />
            </button>

        </div>
    ));
};