{ pkgs ? import (builtins.fetchTarball "https://github.com/NixOS/nixpkgs/archive/aca0bbe791c220f8360bd0dd8e9dce161253b341.tar.gz") { } }:
pkgs.mkShell {
  buildInputs = [ pkgs.nodejs-13_x ];
}
