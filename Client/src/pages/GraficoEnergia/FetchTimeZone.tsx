import { ReactNode } from "react";

export interface TimeZoneApiResponse {
    abbreviation: ReactNode;
    datetime: string;
    timezone: string;
    utc_offset: string
}

export const fetchTimeZoneInfo = async (timezone:string): Promise<TimeZoneApiResponse | null> => {
    const url = `https://worldtimeapi.org/api/timezone/${timezone}`;
    try {
        const response = await fetch(url);
        const data: TimeZoneApiResponse = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching time zone information", error);
        return null;
    }
};

