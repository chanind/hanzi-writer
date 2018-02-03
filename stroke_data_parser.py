import json
import os
from copy import copy

root = os.path.dirname(__file__)
dictionary_file = os.path.join(root, 'vendor/makemeahanzi/dictionary.txt')
graphics_file = os.path.join(root, 'vendor/makemeahanzi/graphics.txt')
output_dir = os.path.join(root, 'data')

positioners = {
  '⿰': 2,
  '⿱': 2,
  '⿲': 3,
  '⿳': 3,
  '⿴': 2,
  '⿵': 2,
  '⿶': 2,
  '⿷': 2,
  '⿸': 2,
  '⿹': 2,
  '⿺': 2,
  '⿻': 2,
}
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


def get_decomp_index(char, subchar):
  "Parse the decomposition tree to figure out what the index of the subchar is within the char"
  stack = []
  for piece in dict_data[char]['decomposition']:
    last_node = None
    path = []
    if len(stack) > 0:
      last_node = stack.pop()
      path = copy(last_node['path'])
      path.append(last_node['children'])
      last_node['children'] += 1
      if last_node['children'] < last_node['size']:
        stack.append(last_node)
    if piece in positioners:
      node = {
        'size': positioners[piece],
        'children': 0,
        'path': path, 
      }
      stack.append(node)
    elif piece == subchar:
      return path
  return None

def get_radical_strokes(char):
  radical = dict_data[char]['radical']
  if char == radical:
    return None
  decomp_index = get_decomp_index(char, radical)
  if not decomp_index:
    return None
  rad_strokes = []
  for stroke_num, match_index in enumerate(dict_data[char]['matches']):
    if match_index == decomp_index:
      rad_strokes.append(stroke_num)
  return rad_strokes


# write out data

for char in graphics_data:
  radical = get_radical_strokes(char)
  if radical:
    graphics_data[char]['radStrokes'] = radical

for char, data in graphics_data.items():
  out_file = os.path.join(output_dir, f'{char}.json')
  with open(out_file, 'w') as f:
    f.write(json.dumps(data, ensure_ascii=False))

with open(os.path.join(output_dir, 'all.json'), 'w') as f:
  f.write(json.dumps(graphics_data, ensure_ascii=False))
