Find P(N, k, k - r)/N! where N is total number, k special ones, k - r remain in place (N = 100, k = 25, r = 22)

P(N, k, k - r) = (nCk)P(N - (k - r), r, 0) = (nCk)Q(N - (k - r), r)

Q(M, 0) = M!
Q(M, 1) = (M - 1)(M - 1)!
Q(M, r) = (M - r)Q(M - 1, r - 1) + (r - 1)Q(M - 1, r - 2)
