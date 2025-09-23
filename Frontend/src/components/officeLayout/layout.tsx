import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";
import "./layout.css";

type Resource = {
    resourceId: number;
    resourceType: string;
    resourceName: string;
    bookings?: Booking[];
};

type Booking = {
    resourceId: number;
    bookingId: number;
    date: number,
    startTime: string;
    endTime: string;
    user: {
        firstName: string;
        lastName: string;
        userName: string;
        id: string;
        isAdmin: boolean;
    };
};

const typeClassMap: { [key: string]: string } = {
    0: "motesrum",
    1: "skrivbord",
    2: "vr-headset",
    3: "ai-server"
};


const Layout = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch resources and bookings at the same time
        const fetchResourcesAndBookings = async () => {
            try {
                const [resRes, resBookings] = await Promise.all([
                    fetch(`${BASE_URL}resource`),
                    fetch(`${BASE_URL}booking`)
                ]);

                if (!resRes.ok) throw new Error("Kunde inte hämta resurser");
                if (!resBookings.ok) throw new Error("Kunde inte hämta bokningar");

                const resourcesData: Resource[] = await resRes.json();
                const bookingsData: Booking[] = await resBookings.json();

                // Sort resources
                const collator = new Intl.Collator("sv", { numeric: true, sensitivity: "base" });
                const sortedResources = resourcesData.sort((a, b) =>
                    collator.compare(a.resourceName, b.resourceName)
                );

                // Connect bookings to each resource
                const resourcesWithBookings = sortedResources.map((res) => {
                    const bookingsForRes = bookingsData
                        .filter((b) => b.resourceId === res.resourceId)
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); // Tidigaste först
                    return {
                        ...res,
                        bookings: bookingsForRes
                    };
                });

                setResources(resourcesWithBookings);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResourcesAndBookings();
    }, []);



    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2 className="layoutHeader"> <i>Hovra över resurs för bokningar</i></h2>
            {loading && (
                <div className="loadingContainerMyBookings">
                    <LoadingSpinner />
                </div>
            )}
            {!loading && (
                <div className="officeGridWrapper">
                    {/* Loops through different types of resources */}
                    {["motesrum", "skrivbord", "vr-headset", "ai-server"].map((type) => {
                        // Filter out resources of types above
                        const filtered = resources.filter(r => typeClassMap[r.resourceType] === type);
                        if (filtered.length === 0) return null;

                        return (
                            // Wrapper for each resourcetype
                            <div key={type} className={`resourceGroup ${type}`}>
                                {/* Render each resource within group */}
                                {filtered.map((res) => (
                                    <div key={res.resourceId} className={`resource ${type}`} data-id={res.resourceId}>
                                        {res.resourceName}
                                        {/* If resource has bookings, show tooltip with details */}
                                        {res.bookings && res.bookings.length > 0 && (
                                            <div className="bookingTooltip">
                                                <h3>Bokningar</h3>
                                                <hr />
                                                {/* List of bookings for resource */}
                                                {res.bookings.map((b) => {
                                                    const startDate = new Date(b.startTime);
                                                    const endDate = new Date(b.endTime);

                                                    return (
                                                        <div key={b.bookingId}>
                                                            {/* Date and time */}
                                                            <b>{startDate.toLocaleDateString("sv-SE")}{" "} </b>
                                                            <i>{startDate.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })} -
                                                            {endDate.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</i>
                                                            <br />
                                                            {/* Owner of booking */}
                                                            <b>{b.user.firstName} {b.user.lastName}</b>
                                                            <p></p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

};

export default Layout;
