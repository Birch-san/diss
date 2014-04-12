#!/usr/bin/python
# -*- coding: utf-8 -*-

# use from within code folder
# call with:
# find . -name \* -print | ../wrapper.py

import sys
import textwrap
import os.path

while True:
	line = sys.stdin.readline()
	if line:
		current = line.split('\n')[0]
		
		fname = './'+current
		if not (os.path.isfile(fname)):
			print fname
			continue
		
		with open(fname, 'r') as content_file:
			content = content_file.read()
		
		# wr = textwrap.TextWrapper(width=37, expand_tabs=True, break_long_words=True, replace_whitespace=False)
		
		# wrapped = wr.wrap(content)
		
		new_body = ""
		lines = content.split("\n")
		
		for line in lines:
			if len(line) > 40:
				w = textwrap.TextWrapper(width=37, break_long_words=True, replace_whitespace=False)
				line = '£'.join(w.wrap(line))
		
			new_body += line + "\n"
		
		print new_body
		
		#nameparts = fname.split('.')
		#nameparts[-2] += '-2'
		#newname = '.'.join(nameparts)
		
		f = open('../code2/'+current, 'w')
		f.write(new_body)
		f.close()
	else:
		sys.exit(0)