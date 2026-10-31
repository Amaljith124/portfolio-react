import { projects as demoProjects } from "../data/projects";
import { defaultPortfolio } from "../data/defaultPortfolio";

// VITE_API_BASE_URL is the API root, e.g. http://localhost:5000/api; the visitor routes live under /general, the public
// portfolio routes under /public and the admin routes under /admin. The old value that ends in /general still works.
export const API_ROOT = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/$/, "").replace(/\/general$/, "");
const BASE_URL = `${API_ROOT}/general`;
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE ?? "true").toLowerCase() === "true";

// Paths of the Node server, relative to BASE_URL. ":slug" is replaced when the request is made.
const endpoints = {
    projects: "/project",
    project: "/project/:slug",
    enquiry: "/enquiry",
    chatStart: "/chat/start",
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

// The public portfolio of a slug: { slug, name, portfolio, theme (resolved), features }. In demo mode only the bundled default exists.
export function getPortfolio(slug)
{
    if (DEMO_MODE)
    {
        return new Promise(function (resolve, reject)
        {
            if (slug === defaultPortfolio.slug)
            {
                resolve(defaultPortfolio);
            }
            else
            {
                reject(new Error("No such portfolio"));
            }
        });
    }
    else
    {
        return makeRequest(`${API_ROOT}/public/portfolios/${encodeURIComponent(slug)}`);
    }
}

// The portfolio behind a magic link token (/portfolio/<token>). Needs the Node server: there is no demo copy.
export function getPortfolioByToken(token)
{
    if (DEMO_MODE)
    {
        return Promise.reject(new Error("No such portfolio"));
    }
    else
    {
        return makeRequest(`${API_ROOT}/public/magic/${encodeURIComponent(token)}`);
    }
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

// slug: the portfolio the enquiry is for (the server uses its default portfolio when it is missing)
export function submitEnquiry(formData, slug)
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
            body: JSON.stringify({ ...formData, slug: slug })
        });
    }
}

// Starts or resumes the chat of a visitor: the session belongs to the email on this portfolio. Resolves
// { sessionId, visitorName, visitorEmail, resumed, messages: [{ role, message, createdDate }] } - the earlier messages of that email, if any.
export function startChatSession(slug, name, email)
{
    if (DEMO_MODE)
    {
        return demoResponse({ sessionId: `demo-session-${Date.now()}`, visitorName: name, visitorEmail: email, resumed: false, messages: [] }, 350, "startChatSession");
    }
    else
    {
        return makeRequest(`${BASE_URL}${endpoints.chatStart}`, {
            method: "POST",
            body: JSON.stringify({ slug: slug, name: name, email: email })
        });
    }
}

export function sendChatMessage(slug, sessionId, message)
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
            body: JSON.stringify({ slug: slug, sessionId: sessionId, message: message })
        });
    }
}
