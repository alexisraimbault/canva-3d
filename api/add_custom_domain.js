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
    const { incoming_address, target_address } = jsonBody

    const url = 'https://cloud.approximated.app/api/vhosts'
    const data = {
        incoming_address: incoming_address,
        target_address: `canva-3d.com/project/${target_address}`,
        target_ports: "443"
    }

    const approximatedApiRes = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.VITE_DOMAIN_API_KEY || ''
        },
        mode: "no-cors",
        body: JSON.stringify(data)
    })
    console.log({ approximatedApiRes })
    const response = await approximatedApiRes.json()
    console.log({ response })
    return new Response(
        JSON.stringify(response), {
        status: approximatedApiRes.status,
        headers: {
            'content-type': 'application/json'
        }
    })
};