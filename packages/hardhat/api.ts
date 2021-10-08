import fetch from "node-fetch";
const GRAPHQL_URL = "https://hub.snapshot.org/graphql";
async function fetchactiveProposals() {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
  proposals (
    first: 20,
    skip: 0,
    where: {
      space_in: ["chiliagon.eth"],
      state: "closed"
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}
      `,
    }),
  });

  const responseBody = await response.json();
  console.log(responseBody);
  let data = responseBody["data"]["proposals"];
  return data;
}
export default fetchactiveProposals();
