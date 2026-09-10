export default {
  async fetch(request) {
    return new Response("Jet2 Virtual Airline API online", {
      headers: {
        "content-type": "text/plain"
      }
    });
  }
};
