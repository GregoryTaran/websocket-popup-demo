const ws = new WebSocket(`wss://${location.host}`);

let pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

let localVideo = document.getElementById("local");
let remoteVideo = document.getElementById("remote");

pc.ontrack = e => {
  remoteVideo.srcObject = e.streams[0];
};

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localVideo.srcObject = stream;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
  });

ws.onmessage = async event => {
  let data = JSON.parse(event.data);

  if (data.answer) {
    await pc.setRemoteDescription(data.answer);
  }

  if (data.offer) {
    await pc.setRemoteDescription(data.offer);
    let answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    ws.send(JSON.stringify({ answer }));
  }

  if (data.ice) {
    try {
      await pc.addIceCandidate(data.ice);
    } catch {}
  }
};

pc.onicecandidate = e => {
  if (e.candidate) ws.send(JSON.stringify({ ice: e.candidate }));
};

document.getElementById("startCall").onclick = async () => {
  let offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ offer }));
};

document.getElementById("answerCall").onclick = () => {};
