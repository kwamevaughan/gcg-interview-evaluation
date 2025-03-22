import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { generateJobPostingSchema } from "@/lib/jobPostingSchema";

export default function PublicJobListings({ jobs }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: jobs.map((job, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: generateJobPostingSchema(job),
        })),
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Debugging: Checking the schema and JSON.stringify result
    console.log("Generated schema:", schema);

    return (
        <div>
            <Head>
                <title>Job Openings | Growthpad Careers</title>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            </Head>
            <h1>Current Job Openings</h1>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <a href={`/hr/jobs/${job.slug}`}>{job.title}</a> - Expires: {job.expires_on}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const { data } = await supabase.from("job_openings").select("*").order("created_at", { ascending: false });
    const jobs = data.map((job) => {
        // Debugging: Check location before parsing
        let parsedLocation = job.location;
        if (parsedLocation && typeof parsedLocation === "string") {
            try {
                parsedLocation = JSON.parse(parsedLocation); // Only parse if it's a string
            } catch (e) {
                console.error("Error parsing location:", e);
            }
        }

        return {
            ...job,
            expires_on: formatDate(job.expires_on),
            is_expired: new Date(job.expires_on) < new Date(),
            location: parsedLocation,
        };
    });

    return { props: { jobs } };
}
