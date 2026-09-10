export default {
  async fetch() {
    return new Response("Jet2 | PTFS API online", {
      headers: {
        "content-type": "text/plain"
      }
    });
  }
};
