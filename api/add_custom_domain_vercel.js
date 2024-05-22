export const config = {
    runtime: 'edge',
};

async function extractBody(request) {
    const dec = new TextDecoder();
    const reader = request.body.getReader();
    let body = ""

    while (true) {
        const { done, value } = await reader.read();
        if (done) return body;

        body = body + dec.decode(value)
    }
}

export default async (request) => {
    const body = await extractBody(request)
    const jsonBody = JSON.parse(body)
    const { subodmain } = jsonBody

    // const getTeamIdUrl = 'https://api.vercel.com/v1/teams'
    // const getTeamUrlRequest = await fetch(getTeamIdUrl, {
    //     method: 'GET',
    //     headers: {
    //         // 'Accept': 'application/json',
    //         // 'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
    //     },
    // })
    // console.log({ getTeamUrlRequest })
    // const getTeamUrlResponse = await getTeamUrlRequest.json()
    // console.log({ getTeamUrlResponse })
    // const teamId = getTeamUrlResponse.teams[0].id

    const teamId = process.env.TEAM_ID_VERCEL
    const projectId = process.env.PROJECT_ID_VERCEL

    const addSubDomainUrl = `https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}`
    const data = {
        name: subodmain
    }
    const addSubDomainRequest = await fetch(addSubDomainUrl, {
        method: 'POST',
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.VERCEL_AUTH_TOKEN}`
        },
        body: JSON.stringify(data)
    })
    console.log({ addSubDomainRequest })
    const addSubDomainResponse = await addSubDomainRequest.json()
    console.log({ addSubDomainResponse })

    return new Response(
        JSON.stringify(addSubDomainResponse), {
        status: addSubDomainResponse.status,
        headers: {
            'content-type': 'application/json'
        }
    })
};