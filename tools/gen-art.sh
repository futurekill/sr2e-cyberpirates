#!/bin/zsh
# Art for the Cyberpirates module via Codex image generation, in the sibling modules' styles
# (refs in _work/ref/style, git-ignored). Prompts: tools/art-prompts.tsv (items + vehicles) and
# tools/critter-prompts.tsv (key, description, habitat). Keys come from `node tools/art-todo.mjs`.
# Output _work/out/<key>.png; existing outputs are skipped, so a re-run resumes.
# Then: python3 tools/fit-art.py, re-run the generators (they pick the art up by file), build-packs.
# Usage: tools/gen-art.sh items|critters|vehicles [batch-size]
set -u
ROOT=/Users/jcandalino/Code/foundryvtt/shadowrun/sr2e-cyberpirates
cd $ROOT || exit 1
KIND=$1; SIZE=${2:-8}; OUT=_work/out; WORK=${TMPDIR:-/tmp}/cp-art-$KIND; mkdir -p $WORK $OUT
typeset -A D H; KEYS=()
if [ $KIND = critters ]; then
  while IFS=$'\t' read -r k d h; do KEYS+=($k); D[$k]=$d; H[$k]=$h; done < tools/critter-prompts.tsv
else
  while IFS=$'\t' read -r k d; do
    [[ $KIND = vehicles && $k = vehicle_portraits/* || $KIND = items && $k = item_icons/* ]] && { KEYS+=($k); D[$k]=$d; }
  done < tools/art-prompts.tsv
fi
case $KIND in
  items) REFS=(-i _work/ref/style/icon-1.webp -i _work/ref/style/icon-2.webp)
    STYLE="Generate inventory icons for a Shadowrun (2050s cyberpunk, here pirates and divers on tropical seas) tabletop game, one image per item, matching the two attached reference icons' style exactly: square 1:1, a single object centred and filling most of the frame, three-quarter view, photoreal-painterly, dark charcoal background with a soft vignette and subtle smoky texture, moody rim lighting with small coloured glow accents. Vary the accent colours per item from its materials (brass, sea-green, rust, orange, steel, teal, red) — do NOT make everything purple. Emblem items (marked 'symbolic emblem') are a single symbolic object in the same style. NO text, NO logos, NO watermarks, NO border, NO hands or people." ;;
  critters) REFS=(-i _work/ref/style/creature-1.webp -i _work/ref/style/creature-2.webp)
    STYLE="Generate creature portraits for a Shadowrun (2050s, magic has returned) tabletop game, one image per creature, matching the attached reference portraits' style: square 1:1, the creature centred and filling much of the frame, dramatic three-quarter view, painterly realism, in a moody atmospheric scene of its habitat (given per creature) with a hint of the 2050s world. Every scene and palette must differ — do NOT default to purple. Ignore game statistics in the descriptions; draw the animal. NO text, NO logos, NO watermarks, NO border, NO people unless the creature itself is humanoid." ;;
  vehicles) REFS=(-i _work/ref/style/vehicle-1.webp -i _work/ref/style/vehicle-2.webp)
    STYLE="Generate vehicle token art for a Shadowrun (2050s) tabletop battle map, one image per vehicle, matching the two attached reference boats exactly: a STRICT top-down (bird's-eye, orthographic) view of the whole vehicle with its FRONT (bow / nose) pointing straight DOWN toward the bottom edge, centred, filling the frame lengthwise, photoreal-painterly with fine weathering, on a fully TRANSPARENT background (PNG with alpha, no shadow, no water, no ground). For submarines and the scooter, show the hull from directly above. For the helicopter, show the rotor blades from above. NO text, NO logos, NO watermarks, NO border, NO people." ;;
esac
while true; do
  todo=(); for k in $KEYS; do [ -f "$OUT/$k.png" ] || todo+=($k); done
  [ ${#todo} -eq 0 ] && { echo "$KIND: all done"; break; }
  [ -n "${ONCE:-}" ] && [ ${RAN:-0} -eq 1 ] && break; RAN=1
  batch=(${todo[1,$SIZE]}); list=""; i=1
  for k in $batch; do
    mkdir -p $OUT/${k%/*}
    list+="$i. ${D[$k]}${H[$k]:+. SETTING: ${H[$k]}}. Save to $OUT/$k.png"$'\n'; i=$((i+1))
  done
  pf=$WORK/prompt.txt
  cat > $pf <<EOF
Use your imagegen skill with the built-in image_gen tool (NOT the CLI fallback).

$STYLE

$list
Save each image as PNG at exactly the path given. Report every saved path.
EOF
  echo "=== $KIND batch of ${#batch} ($(date +%H:%M:%S))"
  timeout 2400 codex exec --skip-git-repo-check -s workspace-write $REFS - < $pf > $WORK/run.log 2>&1
  made=0; for k in $batch; do [ -f "$OUT/$k.png" ] && { echo "   OK   $k"; made=$((made+1)); } || echo "   MISS $k"; done
  if grep -qi 'usage limit' $WORK/run.log; then echo "!! usage limit — see $WORK/run.log"; break; fi
  [ $made -eq 0 ] && { echo "!! nothing made — see $WORK/run.log"; break; }
done
