import isBrowser from './WebpackEnvRunner';

// coverage:ignore-start
function browserAtob(data: string): string {
  return window.atob(data);
}

function browserBtoa(data: string): string {
  return window.btoa(data);
}
// coverage:ignore-end

function nodeAtob(data: string): string {
  const buff = Buffer.from(data);

  return buff.toString('base64');
}

function nodeBtoa(data: string): string {
  const buff = Buffer.from(data, 'base64');
  return buff.toString('utf8');
}

function getAtobFunc() {
  if (isBrowser()) {
    return browserAtob;
  }

  return nodeAtob;
}

function getBtoaFunc() {
  if (isBrowser()) {
    return browserBtoa;
  }

  return nodeBtoa;
}

export default {
  btoa: getBtoaFunc(),
  atob: getAtobFunc(),
};
