import json
import os

root = os.path.dirname(__file__)
dictionary_file = os.path.join(root, 'vendor/makemeahanzi/dictionary.txt')
graphics_file = os.path.join(root, 'vendor/makemeahanzi/graphics.txt')
output_dir = os.path.join(root, 'data')

positioners = {'⿰','⿱','⿲','⿳','⿴','⿵','⿶','⿷','⿸','⿹','⿺','⿻'}
missing_marker = '？'

graphics_data = {}
dict_data = {}

with open(dictionary_file) as f:
  lines = f.readlines()
  for line in lines:
    decoded_line = json.loads(line)
    dict_data[decoded_line['character']] = decoded_line

with open(graphics_file) as f:
  lines = f.readlines()
  for line in lines:
    decoded_line = json.loads(line)
    char = decoded_line.pop('character')
    graphics_data[char] = decoded_line

def num_strokes(char):
  return len(graphics_data[char]['strokes'])

def radical_strokes_forward(char):
  radical = dict_data[char]['radical']
  offset = 0
  for piece in dict_data[char]['decomposition']:
    if piece == radical:
      return [offset, offset + num_strokes(radical)]
    if piece in positioners:
      continue
    if piece == missing_marker:
      return None
    offset += num_strokes(piece)
  return None

def radical_strokes_backwards(char):
  radical = dict_data[char]['radical']
  offset = num_strokes(char)
  for piece in reversed(dict_data[char]['decomposition']):
    if piece == radical:
      return [offset - num_strokes(radical), offset]
    if piece in positioners:
      continue
    if piece == missing_marker:
      return None
    offset -= num_strokes(piece)
  return None

def radical_strokes(char):
  return radical_strokes_forward(char) or radical_strokes_backwards(char)

for char in graphics_data:
  radical = radical_strokes(char)
  if radical:
    graphics_data[char]['rad_strokes'] = radical

for char, data in graphics_data.items():
  out_file = os.path.join(output_dir, f'{char}.json')
  with open(out_file, 'w') as f:
    f.write(json.dumps(data, ensure_ascii=False))

with open(os.path.join(output_dir, 'all.json'), 'w') as f:
  f.write(json.dumps(graphics_data, ensure_ascii=False))
