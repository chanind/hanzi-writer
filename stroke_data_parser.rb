require 'json'

output_folder = File.join(File.dirname(__FILE__), 'data')
input_file = File.join(File.dirname(__FILE__),'vendor/makemeahanzi/graphics.txt')

output = {}
File.readlines(input_file).each do |line|
  data = JSON.parse(line)
  output[data['character']] = data
end

output.each do |char, data|
  File.open(File.join(output_folder, "#{char}.json"), 'w') {|file| file.write(data.to_json) }
end

# combined data.js file
File.open(File.join(output_folder, 'all.json'), 'w') {|file| file.write(output.to_json) }
File.open(File.join(output_folder, 'all.js'), 'w') {|file| file.write('window.hanziData = ' + output.to_json) }