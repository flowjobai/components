"use client";

import Logo from "@/assets/flowjob.svg";
import { User, Settings, Mail, LayoutDashboard as Dashboard, SquareCheckBig as Task, MessageSquareQuote as Quote, Clipboard as Jobs, User as Contact, CircleDollarSign as Deal, BookText as Reports, GanttChartSquare as Project, Clock7 as Time } from "lucide-react";
import Button from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";

const buttons = [
    { icon: <Dashboard size={20} />, text: "Dashboard", route: "/flow/dashboard", tip: "Mission Control for your business" },
    { icon: <Task size={20} />, text: "Tasks", route: "/flow/tasks", tip: "Your TODO list" },
    { icon: <Quote size={20} />, text: "Quotes", route: "/flow/quotes", tip: "Quote for jobs you might get" },
    { icon: <Jobs size={20} />, text: "Jobs", route: "/flow/jobs", tip: "Run the jobs you did get" },
    { icon: <Time size={20} />, text: "Time", route: "/flow/jobs", tip: "Track and bill time" },
    { icon: <Project size={20} />, text: "Projects", route: "/flow/tasks", tip: "Manage longer term projects" },
    { icon: <Contact size={20} />, text: "Contacts", route: "/flow/contacts", tip: "The people you do business with" },
    { icon: <Deal size={20} />, text: "Deals", route: "/flow/deals", tip: "Your deal pipeline" },
    { icon: <Reports size={20} />, text: "Reports", route: "/flow/reports", tip: "All the detail" },
];

export default () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <header className="bg-theme-600 h-16 grid grid-cols-[192px_1fr_auto] items-center text-white gap-4 px-4 font-medium border-b border-dh-300">
            <Logo className="h-6 fill-white cursor-pointer" onClick={() => router.push("/flow/dashboard")} />
            <div className="h-full flex items-stretch">
                {buttons.map(({ icon, text, route, tip }, i) => (
                    <Button key={i} tooltip={tip} className={`${pathname === route ? "bg-theme-700" : "hover:bg-theme-500"} px-4 rounded-none`} onClick={() => router.push(route)}>
                        {icon} {text}
                    </Button>
                ))}
            </div>
            <div className="flex gap-0.5 mr-4">
                <Button className="hover:bg-theme-600" tooltip="Inbox" onClick={() => router.push("/flow/inbox")}>
                    <Mail size={20} />
                </Button>
                <Button className="hover:bg-theme-600" tooltip="Settings" onClick={() => console.log("signout")}>
                    <Settings size={20} />
                </Button>
                <Button className="hover:bg-theme-600" tooltip="Account" onClick={() => console.log("signout")}>
                    <User size={20} />
                </Button>
            </div>
        </header>
    );
};
