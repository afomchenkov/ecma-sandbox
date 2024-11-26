function head(n) {
  if (n == 1) {
    return 1;
  }

  let res = head(n - 1);
  return res * n;
}

function tail(n, s) {
  if (n == 1) {
    return s;
  }

  return tail(n - 1, s * n);
}
