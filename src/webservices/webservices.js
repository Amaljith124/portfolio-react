import { projects as demoProjects } from "../data/projects";

const BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/general"
).replace(/\/$/, "");
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE ?? "true").toLowerCase() === "true";

// Paths of the Node server, relative to BASE_URL. ":slug" is replaced when the request is made.
const endpoints = {
    projects: "/project",
    project: "/project/:slug",
    enquiry: "/enquiry",
    chatMessage: "/chat/message"
};

export function makeRequest(url, options = {})
{
    return new Promise(function (resolve, reject)
    {
        const headers = {
            ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {})
        };

        fetch(url, { ...options, headers: headers })
            .then(function (response)
            {
                response.json()
                    .then(function (payload)
                    {
                        if (!response.ok)
                        {
                            reject(new Error(payload.message || `Request failed (${response.status})`));
                        }
                        else
                        {
                            resolve(payload.data ?? payload);
                        }
                    })
                    .catch(function (error)
                    {
                        console.error(`[webservices.makeRequest] parse response from ${url} failed`, {
                            url: url,
                            error: error
                        });
                        reject(error);
                    });
            })
            .catch(function (error)
            {
                console.error(`[webservices.makeRequest] send request to ${url} failed`, {
                    url: url,
                    error: error
                });
                reject(error);
            });
    });
}

function wait(milliseconds = 300)
{
    return new Promise(function (resolve)
    {
        window.setTimeout(resolve, milliseconds);
    });
}

function demoResponse(data, milliseconds, source)
{
    return new Promise(function (resolve, reject)
    {
        wait(milliseconds)
            .then(function ()
            {
                resolve(data);
            })
            .catch(function (error)
            {
                console.error(`[webservices.${source}] load demo data failed`, error);
                reject(error);
            });
    });
}

export function getProjects()
{
    if (DEMO_MODE)
    {
        return demoResponse(demoProjects, 300, "getProjects");
    }
    else
    {
        return makeRequest(`${BASE_URL}${endpoints.projects}`);
    }
}

export function getProject(slug)
{
    if (DEMO_MODE)
    {
        const project = demoProjects.find(function (item)
        {
            return item.slug === slug;
        });

        if (project)
        {
            return demoResponse(project, 300, "getProject");
        }
        else
        {
            // Same answer as the Node server for an unknown slug (404 "No such project").
            return new Promise(function (resolve, reject)
            {
                wait(300)
                    .then(function ()
                    {
                        reject(new Error("No such project"));
                    })
                    .catch(function (error)
                    {
                        console.error("[webservices.getProject] answer for unknown project failed", { slug: slug, error: error });
                        reject(error);
                    });
            });
        }
    }
    else
    {
        const endpoint = endpoints.project.replace(":slug", encodeURIComponent(slug));
        return makeRequest(`${BASE_URL}${endpoint}`);
    }
}

export function submitEnquiry(formData)
{
    if (DEMO_MODE)
    {
        const result = {
            enquiryId: `demo-${Date.now()}`,
            status: "new"
        };

        return demoResponse(result, 500, "submitEnquiry");
    }
    else
    {
        return makeRequest(`${BASE_URL}${endpoints.enquiry}`, {
            method: "POST",
            body: JSON.stringify(formData)
        });
    }
}

export function sendChatMessage(sessionId, message)
{
    if (DEMO_MODE)
    {
        const result = {
            sessionId: sessionId || `demo-session-${Date.now()}`,
            reply: "Hi! How can I help you?"
        };

        return demoResponse(result, 450, "sendChatMessage");
    }
    else
    {
        return makeRequest(`${BASE_URL}${endpoints.chatMessage}`, {
            method: "POST",
            body: JSON.stringify({ sessionId: sessionId, message: message })
        });
    }
}
