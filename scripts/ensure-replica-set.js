// @ts-nocheck

var c;

try {
	c = rs.config();
} catch {}

var replSet = replSet || 'rs01';
var port = port || '27017';
var hostname = hostname || 'localhost';
var address = address || hostname || '127.0.0.1';
var host = host || `${address}:${port}`;

if (c === undefined) {
	rs.initiate({_id: replSet, members: [{_id: 0, host}]});
} else if (c.members[0].host !== host) {
	c.members[0].host = host;
	rs.reconfig(c);
}

var status = rs.status();

if (status.members[0].health !== 1) quit(2);

quit(0);
